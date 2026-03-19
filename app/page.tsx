'use client';

import { useState } from 'react';
import { BillingProvider } from '@/context/BillingContext';
import Dashboard from '@/components/Dashboard';
import Invoices from '@/components/Invoices';
import Customers from '@/components/Customers';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'customers'>('dashboard');

  return (
    <BillingProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground">Billing System</h1>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'invoices'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Invoices
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'customers'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Customers
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'invoices' && <Invoices />}
          {activeTab === 'customers' && <Customers />}
        </main>
      </div>
    </BillingProvider>
  );
}
