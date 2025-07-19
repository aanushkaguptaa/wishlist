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

    if (item.taken) {
      return NextResponse.json(
        { message: 'Cannot delete an item that has already been taken' },
        { status: 400 }
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

export async function PATCH(request, context) {
  try {
    await connectToDatabase();

    const { itemId } = (await context.params) || {};

    if (!itemId) {
      return NextResponse.json(
        { message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const { name, url } = await request.json();

    if (!name && !url) {
      return NextResponse.json(
        { message: 'Nothing to update' },
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
        { message: 'Cannot edit an item that has already been taken' },
        { status: 400 }
      );
    }

    const update = {};
    if (name) update.name = name;
    if (url !== undefined) update.url = url || null;

    const updatedItem = await Item.findByIdAndUpdate(itemId, update, { new: true });

    return NextResponse.json({
      message: 'Item updated successfully',
      item: updatedItem,
    });

  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}