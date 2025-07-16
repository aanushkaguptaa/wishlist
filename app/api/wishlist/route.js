import { NextResponse } from 'next/server';
import Item from '@/models/item';
import User from '@/models/user';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const { items, userName } = await request.json();

    if (!items || !userName || !Array.isArray(items)) {
      return NextResponse.json(
        { message: 'Items array and userName are required' },
        { status: 400 }
      );
    }

    const itemsToInsert = items.map(item => ({
      name: item.name,
      url: item.url || null,
      taken: false,
      relatedTo: userName,
      takenBy: null,
      createdAt: new Date(),
    }));

    const insertedItems = await Item.insertMany(itemsToInsert);
    const insertedIds = insertedItems.map(item => item._id);

    await User.findOneAndUpdate(
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