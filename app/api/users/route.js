import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // Get all usernames
    const allUsers = await users.find({}, { projection: { username: 1, _id: 0 } }).toArray();
    const usernames = allUsers.map(user => user.username);

    return NextResponse.json({
      users: usernames,
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}