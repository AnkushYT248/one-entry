import {CONNECT_DATABASE, DISCONNECT_DATABASE} from "@/lib/connection/MongoDB";
import { NextResponse } from "next/server";
import User from "@/lib/models/mongoose/UserModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import Cookies from "js-cookie";

export async function POST(req) {
    try {
        const cookieToken = Cookies.get("token");

        if(cookieToken) {
            await CONNECT_DATABASE();
            const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if(user) {
                return;
            }
        }

        const body = await req.json();
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await CONNECT_DATABASE();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already exists. Please login instead." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            authProvider: ["credentials"],
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Set cookie
        cookies().set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json(
            { message: "User created successfully." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }finally {
        await DISCONNECT_DATABASE();
    }
}
