import { NextResponse } from "next/server";
import { CONNECT_DATABASE } from "@/lib/connection/MongoDB";
import User from "@/lib/models/mongoose/UserModel";

export const POST = async (req) => {
    try {
        const { title, description, date, userId } = await req.json();

        // Basic validation
        if (!title || !description || !date || !userId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Connect to DB
        await CONNECT_DATABASE();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: `No user found with this ID: ${userId}` },
                { status: 404 }
            );
        }

        // Prepare entry with ObjectId
        const entry = {
            title,
            description,
            entry_date: date,
        };

        user.entries_data.push(entry);
        await user.save();

        return NextResponse.json(
            {
                message: "Entry Saved Successfully",
                entry,
            },
            { status: 200 }
        );
    } catch (e) {
        console.error("POST error:", e);
        return NextResponse.json(
            { error: "Unknown Error" },
            { status: 500 }
        );
    }
};
