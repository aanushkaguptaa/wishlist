import { NextResponse } from 'next/server';
import Item from '@/models/item';
import User from '@/models/user';
import { connectToDatabase } from '@/lib/mongodb';

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    
    const { itemId } = await params;

    if (!itemId) {
      return NextResponse.json(
        { message: 'Item ID is required' },
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

    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return NextResponse.json(
        { message: 'Failed to delete item' },
        { status: 500 }
      );
    }

    await User.findOneAndUpdate(
      { username: item.relatedTo },
      { $pull: { wishlist: itemId } }
    );

    if (item.taken && item.takenBy) {
      await User.findOneAndUpdate(
        { username: item.takenBy },
        { $pull: { selectedItems: itemId } }
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