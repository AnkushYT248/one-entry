import { CONNECT_DATABASE, DISCONNECT_DATABASE } from "@/lib/connection/MongoDB";
import { NextResponse } from "next/server";
import User from "@/lib/models/mongoose/UserModel";
import mongoose from "mongoose";
import { getUserIdFromRequest } from "@/lib/utils";

export const POST = async (req) => {
    try {
        // Parse request JSON
        const { mood, secondary_mood, mood_comment } = await req.json();
        // Extract user ID from JWT in cookies
        let userId;
        try {
            userId = getUserIdFromRequest(req);
        } catch (err) {
            return NextResponse.json({ error: "Unauthorized: Invalid or missing token." }, { status: 401 });
        }
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

export const DELETE = async (req) => {
    try {
        const { item_ids } = await req.json();
        // Extract user ID from JWT in cookies
        let userId;
        try {
            userId = getUserIdFromRequest(req);
        } catch (err) {
            return NextResponse.json({ error: "Unauthorized: Invalid or missing token." }, { status: 401 });
        }
        // Validate the input
        if (!item_ids) {
            return NextResponse.json(
                { error: "item_ids are required." },
                { status: 400 }
            );
        }
        const idsArray = Array.isArray(item_ids) ? item_ids : [item_ids];
        // Connect to the database
        await CONNECT_DATABASE();
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }
        // Convert item_ids to ObjectId and filter entries
        const objectIds = idsArray.map((id) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.error(`Invalid ID provided: ${id}`);
                throw new Error(`Invalid ID: ${id}`);
            }
            return new mongoose.Types.ObjectId(id);
        });
        user.moods_data = user.moods_data.filter(
            (entry) => !objectIds.some((id) => id.equals(entry._id))
        );
        // Save the updated user
        await user.save();
        return NextResponse.json(
            {
                message: "Mood Entries deleted successfully.",
                deleted_ids: idsArray,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("DELETE error:", err); // Log the actual error
        return NextResponse.json(
            { error: err.message || "An unknown error occurred." },
            { status: 500 }
        );
    } finally {
        await DISCONNECT_DATABASE();
    }
};