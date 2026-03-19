'use client';

import { useBilling } from '@/context/BillingContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Dashboard() {
  const { invoices } = useBilling();

  // Calculate metrics
  const totalOrders = invoices.length;
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const uniqueCustomers = new Set(invoices.map(inv => inv.customerName)).size;

  // Prepare data for Sales over time chart
  const salesByDate = invoices.reduce((acc, inv) => {
    const date = new Date(inv.createdAt).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.sales += inv.grandTotal;
    } else {
      acc.push({ date, sales: inv.grandTotal });
    }
    return acc;
  }, [] as Array<{ date: string; sales: number }>);

  // Prepare data for Top Items chart
  const itemCounts = invoices.reduce((acc, inv) => {
    inv.items.forEach(item => {
      const existing = acc.find(i => i.description === item.description);
      if (existing) {
        existing.count += item.quantity;
        existing.revenue += item.total;
      } else {
        acc.push({ description: item.description, count: item.quantity, revenue: item.total });
      }
    });
    return acc;
  }, [] as Array<{ description: string; count: number; revenue: number }>);

  const topItems = itemCounts.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Overview of your billing metrics</p>
        </div>
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Active invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">LKR {totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Over Time */}
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Daily revenue trend</CardDescription>
          </CardHeader>
          <CardContent>
            {salesByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales (LKR)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle>Top Items</CardTitle>
            <CardDescription>By revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {topItems.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topItems}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="description" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue (LKR)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="print:break-inside-avoid">
        <CardHeader>
          <CardTitle>Detailed Summary</CardTitle>
          <CardDescription>All invoices overview</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-semibold">Customer</th>
                    <th className="text-left py-3 px-2 font-semibold">Items</th>
                    <th className="text-right py-3 px-2 font-semibold">Total</th>
                    <th className="text-left py-3 px-2 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-2">{invoice.customerName}</td>
                      <td className="py-3 px-2">{invoice.items.length}</td>
                      <td className="text-right py-3 px-2 font-semibold">LKR {invoice.grandTotal.toFixed(2)}</td>
                      <td className="py-3 px-2">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No invoices yet. Create one to see data here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
