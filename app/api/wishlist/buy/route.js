import { NextResponse } from 'next/server';
import Item from '@/models/item';
import User from '@/models/user';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const { itemId, buyerId } = await request.json();

    if (!itemId || !buyerId) {
      return NextResponse.json(
        { message: 'Item ID and buyer ID are required' },
        { status: 400 }
      );
    }

    const item = await Item.findById(itemId);

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

    if (item.relatedTo === buyerId) {
      return NextResponse.json(
        { message: 'You cannot buy your own wishlist item' },
        { status: 400 }
      );
    }

    const alreadyBought = await Item.findOne({
      relatedTo: item.relatedTo,
      takenBy: buyerId,
      taken: true,
    });

    if (alreadyBought) {
      return NextResponse.json(
        { message: 'You have already selected an item from this user\'s wishlist' },
        { status: 400 }
      );
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        taken: true,
        takenBy: buyerId,
        takenAt: new Date(),
      },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { message: 'Failed to update item' },
        { status: 500 }
      );
    }

    await User.findOneAndUpdate(
      { username: buyerId },
      { $push: { selectedItems: itemId } }
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