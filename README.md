# Billing System

A professional billing system UI built with Next.js, React, and Tailwind CSS. Manage invoices, track customers, and analyze your sales data with interactive charts.

## Features

### 🎯 Dashboard
- **Key Metrics**: View total orders, total sales, and customer count at a glance
- **Sales Over Time**: Line chart showing daily revenue trends
- **Top Items**: Bar chart displaying your best-performing items by revenue
- **Detailed Summary**: Table with all invoices and their information
- **Export PDF**: Print dashboard data to PDF using browser print-to-PDF feature

### 📄 Invoices
- **Create Invoices**: Add new invoices with customer details and multiple line items
- **Dynamic Items**: Add or remove items from invoices on the fly
- **Auto Calculations**: Item totals and grand totals are calculated automatically
- **Invoice List**: View all invoices with expandable details
- **Export PDF**: Print individual invoices to PDF with formatted layout
- **Delete**: Remove invoices when needed

### 👥 Customers
- **Auto-Add**: Customers are automatically created when you add an invoice
- **View Details**: See customer contact information and invoice count
- **Delete**: Remove customers from your system
- **Card Layout**: Beautiful grid layout showing all customer information

## Tech Stack

- **Framework**: Next.js 16
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API + localStorage

## Data Persistence

Data is stored in browser localStorage and persists across sessions. Each page tracks:
- **Invoices**: Full invoice details including items, customer info, and totals
- **Customers**: Auto-generated from invoices with phone, address, and invoice count

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating an Invoice
1. Go to the Invoices tab
2. Click "Add Invoice"
3. Enter customer details (name, phone, address)
4. Add line items with descriptions, rates, and quantities
5. Totals are automatically calculated
6. Click "Create Invoice"

### Viewing Customers
1. Go to the Customers tab
2. View all customers with their contact information
3. See the number of invoices for each customer
4. Delete customers if needed

### Exporting Data
- **Dashboard**: Click "Export PDF" to print the entire dashboard with charts
- **Invoice**: Click "Export PDF" on any invoice to print it with formatting

## Features Coming Soon

- Database integration for persistent data storage
- Multi-user authentication
- Invoice numbering sequences
- Payment tracking
- Custom invoice templates
- Email invoice delivery
- Multi-currency support

## License

This project is created with v0.app
