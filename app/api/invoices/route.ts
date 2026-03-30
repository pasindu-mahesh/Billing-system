import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('search');

    let query = {};
    if (searchQuery) {
      // Search by invoice number (accepts "INV-2026-1001" or just "1001")
      query = { $or: [
        { invoiceNumber: { $regex: searchQuery, $options: 'i' } }
      ] };
    }

    const invoices = await db.collection('invoices').find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    
    // Generate invoice number in format: INV-YYYY-XXXX (e.g., INV-2026-1001)
    const currentYear = new Date().getFullYear();
    const yearPrefix = `INV-${currentYear}-`;
    
    // Find latest invoice for current year
    const latestYearInvoice = await db.collection('invoices')
      .findOne({ invoiceNumber: { $regex: `^INV-${currentYear}-` } }, { sort: { invoiceNumber: -1 } });
    
    let sequenceNumber = 1001;
    if (latestYearInvoice?.invoiceNumber) {
      const lastSeq = parseInt(latestYearInvoice.invoiceNumber.split('-')[2]);
      sequenceNumber = lastSeq + 1;
    }
    
    const formattedInvoiceNumber = `INV-${currentYear}-${sequenceNumber}`;
    
    const createdAt = new Date();
    const result = await db.collection('invoices').insertOne({
      ...body,
      invoiceNumber: formattedInvoiceNumber,
      createdAt,
    });
    
    return NextResponse.json({ ...body, id: result.insertedId.toString(), invoiceNumber: formattedInvoiceNumber, createdAt }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      console.error('Invalid ObjectId format:', id, e);
      return NextResponse.json({ error: 'Invalid invoice ID format' }, { status: 400 });
    }

    const result = await db.collection('invoices').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await db.collection('invoices').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
