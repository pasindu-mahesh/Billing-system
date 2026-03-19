'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, Customer, InvoiceItem } from '@/types/billing';

interface BillingContextType {
  invoices: Invoice[];
  customers: Customer[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  deleteCustomer: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    const savedCustomers = localStorage.getItem('customers');
    
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
  }, []);

  // Save invoices to localStorage
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Save customers to localStorage
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices]);

    // Auto-add or update customer
    const existingCustomer = customers.find(c => c.name === invoice.customerName);
    
    if (existingCustomer) {
      const updatedCustomer: Customer = {
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
      setCustomers([newCustomer, ...customers]);
    }
  };

  const updateInvoice = (id: string, updatedInvoice: Invoice) => {
    setInvoices(invoices.map(i => i.id === id ? updatedInvoice : i));
  };

  const deleteInvoice = (id: string) => {
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
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(i => i.id === id);
  };

  return (
    <BillingContext.Provider value={{ invoices, customers, addInvoice, updateInvoice, deleteInvoice, deleteCustomer, getInvoiceById }}>
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
