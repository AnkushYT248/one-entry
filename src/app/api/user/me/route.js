// Fix for verifying API key and token
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/models/mongoose/UserModel";
import {CONNECT_DATABASE} from "@/lib/connection/MongoDB";

export const GET = async (req) => {
  try {
    const headers = req.headers;
    const api_key = headers.get("authorization");

    // Check if the API key is provided and valid
    if (!api_key || api_key !== `Bearer ${process.env.AUTH_API_KEY}`) {
      return NextResponse.json(
        {
          error: "Unauthorized: Invalid API key",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    // Verify token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized: No token found",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;

    await CONNECT_DATABASE();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: `No user found with this ID: ${id}` }, { status: 404 });
    }
    return NextResponse.json({ user: user }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/user/me:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};