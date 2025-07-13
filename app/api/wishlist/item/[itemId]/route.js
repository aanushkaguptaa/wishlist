import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
  try {
    const { itemId } = await params;

    if (!itemId) {
      return NextResponse.json(
        { message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const itemsCollection = db.collection('items');
    const usersCollection = db.collection('users');

    // Find the item first to get related user info
    const item = await itemsCollection.findOne({ _id: new ObjectId(itemId) });

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    // Delete the item
    const deleteResult = await itemsCollection.deleteOne({ _id: new ObjectId(itemId) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Failed to delete item' },
        { status: 500 }
      );
    }

    // Remove item from user's wishlist
    await usersCollection.updateOne(
      { username: item.relatedTo },
      { $pull: { wishlist: new ObjectId(itemId) } }
    );

    // If item was taken, remove from buyer's selectedItems
    if (item.taken && item.takenBy) {
      await usersCollection.updateOne(
        { username: item.takenBy },
        { $pull: { selectedItems: new ObjectId(itemId) } }
      );
    }

    return NextResponse.json({
      message: 'Item deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}