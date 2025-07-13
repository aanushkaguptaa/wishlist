import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { items, userName } = await request.json();

    if (!items || !userName || !Array.isArray(items)) {
      return NextResponse.json(
        { message: 'Items array and userName are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const itemsCollection = db.collection('items');
    const usersCollection = db.collection('users');

    // Create items with proper structure
    const itemsToInsert = items.map(item => ({
      name: item.name,
      url: item.url || null,
      taken: false,
      relatedTo: userName,
      takenBy: null,
      createdAt: new Date(),
    }));

    // Insert items
    const result = await itemsCollection.insertMany(itemsToInsert);
    const insertedIds = Object.values(result.insertedIds);

    // Update user's wishlist
    await usersCollection.updateOne(
      { username: userName },
      { $push: { wishlist: { $each: insertedIds } } }
    );

    return NextResponse.json({
      message: 'Items added successfully',
      itemIds: insertedIds,
    });

  } catch (error) {
    console.error('Error adding items:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}