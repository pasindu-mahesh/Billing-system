'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BillingProvider } from '@/context/BillingContext';
import Dashboard from '@/components/Dashboard';
import Invoices from '@/components/Invoices';
import Customers from '@/components/Customers';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, logout, admin } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'customers'>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    if (authMode === 'login') {
      return <Login onSwitchToRegister={() => setAuthMode('register')} />;
    } else {
      return <Register onSwitchToLogin={() => setAuthMode('login')} />;
    }
  }

  return (
    <BillingProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Billing System</h1>
              {admin && (
                <p className="text-sm text-muted-foreground mt-1">Logged in as: {admin.email}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
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
