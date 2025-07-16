import { NextResponse } from 'next/server';
import Item from '@/models/item';
import User from '@/models/user';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
    try {
        await connectToDatabase();

        const { itemId, username } = await request.json();

        if (!itemId || !username) {
            return NextResponse.json(
                { message: 'Item ID and username are required' },
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

        if (!item.taken) {
            return NextResponse.json(
                { message: 'Item is not currently taken' },
                { status: 400 }
            );
        }

        if (item.takenBy !== username) {
            return NextResponse.json(
                { message: 'You can only unselect items that you have taken' },
                { status: 403 }
            );
        }

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            {
                taken: false,
                takenBy: null,
                takenAt: null,
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
            { username: username },
            { $pull: { selectedItems: itemId } }
        );

        return NextResponse.json({
            message: 'Item unselected successfully',
        });

    } catch (error) {
        console.error('Error unselecting item:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}