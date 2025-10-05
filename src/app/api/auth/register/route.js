// src/app/api/auth/register/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 });
    }
}