import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { itemId, buyerId } = await request.json();

    if (!itemId || !buyerId) {
      return NextResponse.json(
        { message: 'Item ID and buyer ID are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const itemsCollection = db.collection('items');
    const usersCollection = db.collection('users');

    // Check if item exists and is not already taken
    const item = await itemsCollection.findOne({ _id: new ObjectId(itemId) });

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    if (item.taken) {
      return NextResponse.json(
        { message: 'Item is already taken' },
        { status: 400 }
      );
    }

    // Update item to mark as taken
    const updateResult = await itemsCollection.updateOne(
      { _id: new ObjectId(itemId) },
      {
        $set: {
          taken: true,
          takenBy: buyerId,
          takenAt: new Date(),
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Failed to update item' },
        { status: 500 }
      );
    }

    // Add item to buyer's selectedItems
    await usersCollection.updateOne(
      { username: buyerId },
      { $push: { selectedItems: new ObjectId(itemId) } }
    );

    return NextResponse.json({
      message: 'Item marked as taken successfully',
    });

  } catch (error) {
    console.error('Error buying item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}