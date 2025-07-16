import { NextResponse } from 'next/server';
import Item from '@/models/item';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request, { params }) {
    try {
        await connectToDatabase();

        const { username } = await params;

        if (!username) {
            return NextResponse.json(
                { message: 'Username is required' },
                { status: 400 }
            );
        }

        const items = await Item.find({ takenBy: username })
            .sort({ takenAt: -1 })
            .lean();

        return NextResponse.json({
            items,
        });

    } catch (error) {
        console.error('Error fetching selected items:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}