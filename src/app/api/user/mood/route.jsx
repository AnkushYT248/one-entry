import { CONNECT_DATABASE, DISCONNECT_DATABASE } from "@/lib/connection/MongoDB";
import { NextResponse } from "next/server";
import User from "@/lib/models/mongoose/UserModel";

export const POST = async (req) => {
    try {
        // Parse request JSON
        const {mood, secondary_mood, mood_comment, userId } = await req.json();

        // Input validation
        if (!mood || typeof mood !== "string") {
            return NextResponse.json(
                { error: "The 'mood' field is required and must be a string." },
                { status: 400 }
            );
        }
        if (!secondary_mood || typeof secondary_mood !== "string") {
            return NextResponse.json(
                { error: "The 'secondary_mood' field is required and must be a string." },
                { status: 400 }
            );
        }
        if (!mood_comment || typeof mood_comment !== "string") {
            return NextResponse.json(
                { error: "The 'mood_comment' field is required and must be a string." },
                { status: 400 }
            );
        }
        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { error: "The 'userId' field is required and must be a valid string." },
                { status: 400 }
            );
        }

        // Connect to the database
        await CONNECT_DATABASE();

        // Fetch the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { error: `No user found with the provided ID: ${userId}` },
                { status: 404 }
            );
        }

        // Mood data preparation
        const moodData = {
            mood,
            secondary_mood,
            mood_comment,
        };

        // Add the new mood entry and save the user
        user.moods_data.push(moodData);
        await user.save();

        // Successful response
        return NextResponse.json(
            { message: "Mood data added successfully!" },
            { status: 201 }
        );
    } catch (err) {
        // Log the error for debugging purposes
        console.error("An error occurred while processing the request:", err);

        // Generic server error response
        return NextResponse.json(
            { error: "An internal server error occurred. Please try again later." },
            { status: 500 }
        );
    } finally {
        // Ensure database disconnection
        await DISCONNECT_DATABASE();
    }
};