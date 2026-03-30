'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, Customer } from '@/types/billing';

interface BillingContextType {
  invoices: Invoice[];
  customers: Customer[];
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (id: string, invoice: Invoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getInvoiceById: (id: string) => Invoice | undefined;
  isLoading: boolean;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from MongoDB on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesRes, customersRes] = await Promise.all([
          fetch('/api/invoices'),
          fetch('/api/customers'),
        ]);

        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json();
          setInvoices(invoicesData.map((inv: any) => (
            {
              id: inv._id?.toString?.() || inv._id || inv.id || '',
              invoiceNumber: inv.invoiceNumber,
              customerName: inv.customerName,
              phoneNumber: inv.phoneNumber,
              address: inv.address,
              items: inv.items,
              subtotal: inv.subtotal,
              advancePayment: inv.advancePayment,
              grandTotal: inv.grandTotal,
              createdAt: new Date(inv.createdAt),
            }
          )));
        }

        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData.map((cust: any) => ({
            id: cust._id,
            name: cust.name,
            phoneNumber: cust.phoneNumber,
            address: cust.address,
            invoiceCount: cust.invoiceCount,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addInvoice = async (invoice: Invoice) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      });

      if (!response.ok) throw new Error('Failed to add invoice');

      const newInvoice = await response.json();
      setInvoices([{ ...invoice, id: newInvoice.id, invoiceNumber: newInvoice.invoiceNumber, createdAt: new Date(newInvoice.createdAt) }, ...invoices]);

      // Auto-add or update customer
      const existingCustomer = customers.find(c => c.name === invoice.customerName);

      if (existingCustomer) {
        const updatedCustomer = {
          ...existingCustomer,
          invoiceCount: existingCustomer.invoiceCount + 1,
        };
        setCustomers([
          updatedCustomer,
          ...customers.filter(c => c.name !== invoice.customerName),
        ]);
      } else {
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          name: invoice.customerName,
          phoneNumber: invoice.phoneNumber,
          address: invoice.address,
          invoiceCount: 1,
        };
        
        try {
          await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCustomer),
          });
        } catch (error) {
          console.error('Failed to create customer:', error);
        }

        setCustomers([newCustomer, ...customers]);
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  const updateInvoice = async (id: string, updatedInvoice: Invoice) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedInvoice }),
      });

      if (!response.ok) throw new Error('Failed to update invoice');

      setInvoices(invoices.map(inv => inv.id === id ? updatedInvoice : inv));
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete invoice');

      const invoice = invoices.find(i => i.id === id);
      if (invoice) {
        setInvoices(invoices.filter(i => i.id !== id));

        // Decrement customer invoice count
        setCustomers(customers.map(c =>
          c.name === invoice.customerName
            ? { ...c, invoiceCount: Math.max(0, c.invoiceCount - 1) }
            : c
        ));
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const response = await fetch(`/api/customers?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete customer');

      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(i => i.id === id);
  };

  return (
    <BillingContext.Provider
      value={{
        invoices,
        customers,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        deleteCustomer,
        getInvoiceById,
        isLoading,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within BillingProvider');
  }
  return context;
}
