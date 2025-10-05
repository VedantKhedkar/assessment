// src/app/api/auth/login/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        // 1. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            // If user doesn't exist, send an error
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // 2. Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            // If passwords don't match, send an error
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // 3. If everything is correct, create and return a login token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return NextResponse.json({ token }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}