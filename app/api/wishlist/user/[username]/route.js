import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    // Await params before destructuring
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { message: 'Username is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const itemsCollection = db.collection('items');

    // Find all items for this user
    const items = await itemsCollection
      .find({ relatedTo: username })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      items,
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}