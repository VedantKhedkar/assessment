// src/app/api/vault/route.js
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";
import VaultItem from "@/models/VaultItem";
import { NextResponse } from "next/server";

// GET: Fetch all vault items for the logged-in user
export async function GET(request) {
    const auth = verifyToken(request);
    if (auth.error) {
        return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const items = await VaultItem.find({ userId: auth.userId });
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// POST: Create a new vault item
export async function POST(request) {
    const auth = verifyToken(request);
    if (auth.error) {
        return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    try {
        const { title, username, encryptedPassword, url, notes } = await request.json();
        
        // Basic validation
        if (!title || !username || !encryptedPassword) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }
        
        await dbConnect();
        const newItem = await VaultItem.create({
            userId: auth.userId,
            title,
            username,
            encryptedPassword,
            url,
            notes
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PUT: Update an existing vault item
export async function PUT(request) {
    const auth = verifyToken(request);
    if (auth.error) {
        return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    try {
        const { _id, title, username, encryptedPassword, url, notes } = await request.json();

        if (!_id) {
            return NextResponse.json({ message: "Item ID is required" }, { status: 400 });
        }

        await dbConnect();
        // Crucially, we find the item by its ID AND the userId to ensure a user can only edit their own items.
        const updatedItem = await VaultItem.findOneAndUpdate(
            { _id: _id, userId: auth.userId },
            { title, username, encryptedPassword, url, notes },
            { new: true } // This option returns the document after it has been updated
        );

        if (!updatedItem) {
            return NextResponse.json({ message: "Item not found or user unauthorized" }, { status: 404 });
        }

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// DELETE: Remove a vault item
export async function DELETE(request) {
    const auth = verifyToken(request);
    if (auth.error) {
        return NextResponse.json({ message: auth.error }, { status: auth.status });
    }

    try {
        const { _id } = await request.json();

        if (!_id) {
            return NextResponse.json({ message: "Item ID is required" }, { status: 400 });
        }
        
        await dbConnect();
        // We also use userId here for security
        const deletedItem = await VaultItem.findOneAndDelete({ _id: _id, userId: auth.userId });

        if (!deletedItem) {
            return NextResponse.json({ message: "Item not found or user unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}