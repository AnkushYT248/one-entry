import { NextResponse } from "next/server";
import {CONNECT_DATABASE, DISCONNECT_DATABASE} from "@/lib/connection/MongoDB";
import User from "@/lib/models/mongoose/UserModel";
import mongoose from "mongoose";
import { getUserIdFromRequest } from "@/lib/utils";

export const POST = async (req) => {
    try {
        const { title, description, date } = await req.json();
        // Extract user ID from JWT in cookies
        let userId;
        try {
            userId = getUserIdFromRequest(req);
        } catch (err) {
            return NextResponse.json({ error: "Unauthorized: Invalid or missing token." }, { status: 401 });
        }
        // Basic validation
        if (!title || !description || !date) {
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
    }finally {
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
        user.entries_data = user.entries_data.filter(
            (entry) => !objectIds.some((id) => id.equals(entry._id))
        );
        // Save the updated user
        await user.save();
        return NextResponse.json(
            {
                message: "Entries deleted successfully.",
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