import { NextResponse } from 'next/server';
import User from '@/models/user';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    
    const users = await User.find({}, 'username').lean();
    const usernames = users.map(user => user.username);

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