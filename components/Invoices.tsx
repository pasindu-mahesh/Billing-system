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

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    items: [{ id: '1', itemNumber: '', description: '', rate: 0, quantity: 0 }],
  });

  const resetForm = () => {
    setFormData({
      customerName: '',
      phoneNumber: '',
      address: '',
      items: [{ id: '1', itemNumber: '', description: '', rate: 0, quantity: 0 }],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const items: InvoiceItem[] = formData.items.map(item => ({
      ...item,
      rate: Number(item.rate),
      quantity: Number(item.quantity),
      total: Number(item.rate) * Number(item.quantity),
    }));

    const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

    if (editingInvoice) {
      const updatedInvoice: Invoice = {
        ...editingInvoice,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        items,
        grandTotal,
      };
      updateInvoice(editingInvoice.id, updatedInvoice);
    } else {
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        items,
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

    const content = `
      <html>
        <head>
          <title>Invoice ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .invoice-header { text-align: center; margin-bottom: 30px; }
            .invoice-header h1 { margin: 0; color: #1f2937; }
            .customer-details { margin-bottom: 20px; }
            .customer-details p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .total-row { font-weight: bold; background-color: #f3f4f6; }
            .grand-total { font-size: 18px; color: #1f2937; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <h1>Invoice</h1>
            <p>Invoice ID: ${invoice.id}</p>
          </div>
          
          <div class="customer-details">
            <p><strong>Customer Name:</strong> ${invoice.customerName}</p>
            <p><strong>Phone:</strong> ${invoice.phoneNumber}</p>
            <p><strong>Address:</strong> ${invoice.address}</p>
            <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Number</th>
                <th>Description</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.itemNumber}</td>
                  <td>${item.description}</td>
                  <td>LKR ${item.rate.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>LKR ${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4" style="text-align: right;">Grand Total:</td>
                <td class="grand-total">LKR ${invoice.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
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
                    <div key={item.id} className="flex gap-2 items-end p-3 bg-muted rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Item Number"
                          value={item.itemNumber}
                          onChange={(e) => handleItemChange(item.id, 'itemNumber', e.target.value)}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="w-20 space-y-2">
                        <Input
                          placeholder="Rate"
                          type="number"
                          step="0.01"
                          value={item.rate || ''}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                        />
                      </div>
                      <div className="w-20 space-y-2">
                        <Input
                          placeholder="Qty"
                          type="number"
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="w-24 space-y-2">
                        <div className="text-right font-semibold text-sm">
                          LKR {calculateTotal(Number(item.rate) || 0, Number(item.quantity) || 0).toFixed(2)}
                        </div>
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
                  ))}
                </div>
              </div>

              {/* Grand Total */}
              <div className="text-right text-lg font-bold text-foreground">
                Grand Total: LKR {formData.items.reduce((sum, item) => sum + calculateTotal(Number(item.rate) || 0, Number(item.quantity) || 0), 0).toFixed(2)}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full">
                {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {invoices.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p>No invoices yet. Create one to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{invoice.customerName}</CardTitle>
                    <CardDescription>Invoice ID: {invoice.id}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">LKR {invoice.grandTotal.toFixed(2)}</div>
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
