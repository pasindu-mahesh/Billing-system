<<<<<<< HEAD
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
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 7225aa2bbe06289dfcefcf844012d39db1a0b1a3
