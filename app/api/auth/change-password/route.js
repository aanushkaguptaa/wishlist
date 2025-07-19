import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
    try {
        await connectToDatabase();

        const { username, oldPassword, newPassword } = await request.json();

        if (!username || !oldPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Username, old password, and new password are required' },
                { status: 400 }
            );
        }

        const trimmedUsername = username.trim();
        const trimmedOldPassword = oldPassword.trim();
        const trimmedNewPassword = newPassword.trim();

        if (trimmedNewPassword.length < 6) {
            return NextResponse.json(
                { message: 'New password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ username: trimmedUsername });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const isValidOldPassword = await bcrypt.compare(trimmedOldPassword, user.password);

        if (!isValidOldPassword) {
            return NextResponse.json(
                { message: 'Current password is incorrect' },
                { status: 401 }
            );
        }

        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(trimmedNewPassword, saltRounds);

        await User.findOneAndUpdate(
            { username: trimmedUsername },
            { password: hashedNewPassword }
        );

        return NextResponse.json({
            message: 'Password changed successfully',
        });

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}