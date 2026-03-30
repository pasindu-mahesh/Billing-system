'use client';

import { useState } from 'react';
import { useBilling } from '@/context/BillingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Download, Plus, Edit2 } from 'lucide-react';
import { Invoice, InvoiceItem } from '@/types/billing';

export default function Invoices() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useBilling();
  const [isOpen, setIsOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    items: [{ id: '1', itemNumber: '', description: '', rate: 0, quantity: 0 }],
    advancePayment: 0,
  });

  const resetForm = () => {
    setFormData({
      customerName: '',
      phoneNumber: '',
      address: '',
      items: [{ id: '1', itemNumber: '', description: '', rate: 0, quantity: 0 }],
      advancePayment: 0,
    });
    setEditingInvoice(null);
  };

  const openEditDialog = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      customerName: invoice.customerName,
      phoneNumber: invoice.phoneNumber,
      address: invoice.address,
      items: invoice.items,
      advancePayment: invoice.advancePayment || 0,
    });
    setIsOpen(true);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      itemNumber: '',
      description: '',
      rate: 0,
      quantity: 0,
      total: 0,
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const handleRemoveItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id),
    });
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const calculateTotal = (rate: number, quantity: number) => rate * quantity;

  const filteredInvoices = invoices.filter(inv => 
    searchTerm === '' || String(inv.invoiceNumber).toLowerCase().includes(searchTerm.toLowerCase()) || inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const items: InvoiceItem[] = formData.items.map(item => ({
      ...item,
      rate: Number(item.rate),
      quantity: Number(item.quantity),
      total: Number(item.rate) * Number(item.quantity),
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const advancePayment = Math.max(0, Number(formData.advancePayment) || 0);
    const grandTotal = Math.max(0, subtotal - advancePayment);

    if (editingInvoice) {
      const updatedInvoice: Invoice = {
        ...editingInvoice,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        items,
        subtotal,
        advancePayment,
        grandTotal,
      };
      updateInvoice(editingInvoice.id, updatedInvoice);
    } else {
      const newInvoice: Invoice = {
        id: '',
        invoiceNumber: '',
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        items,
        subtotal,
        advancePayment,
        grandTotal,
        createdAt: new Date(),
      };
      addInvoice(newInvoice);
    }

    resetForm();
    setIsOpen(false);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const companyName = 'Pasindu Mahesh Photography';
    const companyEmail = 'pasinduzone@gmail.com';
    const companyPhone = '+94 76 830 2475';
    const invoiceDate = new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const content = `
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              padding: 40px;
              color: #333;
              background-color: #fff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .company-header {
              background-color: #6e6e6e !important;
              color: white !important;
              padding: 30px;
              text-align: center;
              margin-bottom: 40px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .company-header h1 {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
              letter-spacing: 1px;
              color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .company-header p {
              font-size: 14px;
              margin: 5px 0;
              color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .invoice-title {
              text-align: center;
              font-size: 36px;
              font-weight: bold;
              margin: 50px 0 10px 0;
              letter-spacing: 4px;
              color: #666666 !important;
              font-family: 'Georgia', serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .invoice-id {
              text-align: center;
              font-size: 14px;
              margin-bottom: 40px;
              color: #333;
            }
            .customer-section {
              margin-bottom: 30px;
              margin-left: 0;
              font-size: 14px;
            }
            .customer-row {
              margin-bottom: 8px;
            }
            .customer-label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .customer-value {
              display: inline-block;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
              font-size: 13px;
              border: 1px solid #000;
            }
            .items-table thead tr {
              border-bottom: 1px solid #000;
            }
            .items-table th {
              border-right: 1px solid #000;
              padding: 12px 8px;
              font-weight: bold;
              text-align: left;
              background-color: #ffffff;
              font-size: 13px;
              border-bottom: 1px solid #000;
            }
            .items-table th:last-child {
              border-right: none;
            }
            .items-table td {
              border-right: 1px solid #000;
              padding: 12px 8px;
              min-height: 20px;
            }
            .items-table td:last-child {
              border-right: none;
            }
            .items-table tbody tr {
              border-bottom: 1px solid #000;
            }
            .items-table tbody tr:last-child {
              border-bottom: 1px solid #000;
            }
            .text-right {
              text-align: right;
            }
            .total-row td {
              border-right: 1px solid #000;
              padding: 12px 8px;
              font-weight: normal;
            }
            .total-row td:last-child {
              border-right: none;
            }
            .total-row-label {
              text-align: right;
              font-weight: normal;
              color: #000;
            }
            .total-row-value {
              text-align: right;
              font-weight: normal;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 80px;
              font-size: 13px;
              padding: 0 40px;
            }
            .signature-box {
              text-align: center;
              width: 35%;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 50px;
              padding-top: 8px;
              min-width: 150px;
            }
          </style>
        </head>
        <body>
          <!-- Company Header -->
          <div class="company-header">
            <h1>${companyName}</h1>
            <p>${companyEmail}</p>
            <p>${companyPhone}</p>
          </div>

          <!-- Invoice Title -->
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-id">Invoice ${invoice.invoiceNumber}</div>

          <!-- Customer Details -->
          <div class="customer-section">
            <div class="customer-row">
              <span class="customer-label">Customer Name:</span>
              <span class="customer-value">${invoice.customerName}</span>
            </div>
            <div class="customer-row">
              <span class="customer-label">Phone:</span>
              <span class="customer-value">${invoice.phoneNumber}</span>
            </div>
            <div class="customer-row">
              <span class="customer-label">Address:</span>
              <span class="customer-value">${invoice.address}</span>
            </div>
            <div class="customer-row">
              <span class="customer-label">Date:</span>
              <span class="customer-value">${invoiceDate}</span>
            </div>
          </div>

          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 12%;">Item Number</th>
                <th style="width: 38%;">Description</th>
                <th style="width: 15%;">Rate</th>
                <th style="width: 15%;">Qty</th>
                <th style="width: 20%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.itemNumber}</td>
                  <td>${item.description}</td>
                  <td class="text-right">${item.rate.toFixed(2)}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4" class="total-row-label">Subtotal:</td>
                <td class="total-row-value">${(invoice.subtotal ?? invoice.grandTotal + (invoice.advancePayment || 0)).toFixed(2)}</td>
              </tr>
              ${(invoice.advancePayment || 0) > 0 ? `
              <tr class="total-row">
                <td colspan="4" class="total-row-label">Advance Payment:</td>
                <td class="total-row-value">- ${invoice.advancePayment.toFixed(2)}</td>
              </tr>` : ''}
              <tr class="total-row">
                <td colspan="4" class="total-row-label">Invoice Amount:</td>
                <td class="total-row-value">${invoice.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Signature Section -->
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>Prepared By</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>Customer</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Invoices</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your invoices</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
              <DialogDescription>{editingInvoice ? 'Update invoice details and items' : 'Add invoice details and items'}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Customer Details</h3>
                <Input
                  placeholder="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
                <Input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              {/* Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {formData.items.map((item) => (
                    <div key={item.id} className="p-3 bg-muted rounded-lg space-y-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Item Number</label>
                        <Input
                          placeholder="Item Number"
                          value={item.itemNumber}
                          onChange={(e) => handleItemChange(item.id, 'itemNumber', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Rate</label>
                          <Input
                            placeholder="Rate"
                            type="number"
                            step="0.01"
                            value={item.rate || ''}
                            onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Quantity</label>
                          <Input
                            placeholder="Qty"
                            type="number"
                            value={item.quantity || ''}
                            onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="font-semibold text-sm text-foreground">
                          Total: LKR {calculateTotal(Number(item.rate) || 0, Number(item.quantity) || 0).toFixed(2)}
                        </div>
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advance Payment */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Advance Payment</h3>
                <Input
                  placeholder="Advance Payment (Rs.)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.advancePayment || ''}
                  onChange={(e) => setFormData({ ...formData, advancePayment: Number(e.target.value) || 0 })}
                />
              </div>

              {/* Totals Breakdown */}
              {(() => {
                const subtotal = formData.items.reduce((sum, item) => sum + calculateTotal(Number(item.rate) || 0, Number(item.quantity) || 0), 0);
                const advance = Math.max(0, Number(formData.advancePayment) || 0);
                const grandTotal = Math.max(0, subtotal - advance);
                return (
                  <div className="space-y-1 text-right border-t border-border pt-3">
                    <div className="text-sm text-muted-foreground">
                      Subtotal: LKR {subtotal.toFixed(2)}
                    </div>
                    {advance > 0 && (
                      <div className="text-sm text-green-500">
                        Advance Payment: - LKR {advance.toFixed(2)}
                      </div>
                    )}
                    <div className="text-lg font-bold text-foreground">
                      Grand Total: LKR {grandTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })()}

              {/* Submit */}
              <Button type="submit" className="w-full">
                {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by invoice number or customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p>{searchTerm ? 'No invoices match your search.' : 'No invoices yet. Create one to get started.'}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.invoiceNumber} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{invoice.customerName}</CardTitle>
                    <CardDescription>{invoice.invoiceNumber}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">LKR {invoice.grandTotal.toFixed(2)}</div>
                    {(invoice.advancePayment || 0) > 0 && (
                      <div className="text-xs text-green-500">Advance: LKR {invoice.advancePayment.toFixed(2)}</div>
                    )}
                    <div className="text-xs text-muted-foreground">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{invoice.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium text-foreground">{invoice.address}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2">Item #</th>
                          <th className="text-left py-2 px-2">Description</th>
                          <th className="text-right py-2 px-2">Rate</th>
                          <th className="text-right py-2 px-2">Qty</th>
                          <th className="text-right py-2 px-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item) => (
                          <tr key={item.id} className="border-b border-border">
                            <td className="py-2 px-2">{item.itemNumber}</td>
                            <td className="py-2 px-2">{item.description}</td>
                            <td className="text-right py-2 px-2">LKR {item.rate.toFixed(2)}</td>
                            <td className="text-right py-2 px-2">{item.quantity}</td>
                            <td className="text-right py-2 px-2 font-semibold">LKR {item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Breakdown on Card */}
                  <div className="flex flex-col items-end gap-1 text-sm">
                    <div className="text-muted-foreground">
                      Subtotal: LKR {(invoice.subtotal ?? invoice.grandTotal + (invoice.advancePayment || 0)).toFixed(2)}
                    </div>
                    {(invoice.advancePayment || 0) > 0 && (
                      <div className="text-green-500">
                        Advance Payment: - LKR {invoice.advancePayment.toFixed(2)}
                      </div>
                    )}
                    <div className="text-base font-bold text-foreground">
                      Grand Total: LKR {invoice.grandTotal.toFixed(2)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(invoice)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrintInvoice(invoice)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export PDF
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirmId(invoice.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  deleteInvoice(deleteConfirmId);
                  setDeleteConfirmId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
