export interface InvoiceItem {
  id: string;
  itemNumber: string;
  description: string;
  rate: number;
  quantity: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  items: InvoiceItem[];
  subtotal: number;
  advancePayment: number;
  grandTotal: number;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  invoiceCount: number;
}
