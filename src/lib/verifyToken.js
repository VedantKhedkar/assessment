// src/lib/verifyToken.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const verifyToken = (request) => {
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return { error: "No token provided", status: 401 };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { userId: decoded.id };

    } catch (error) {
        return { error: "Invalid or expired token", status: 403 };
    }
};