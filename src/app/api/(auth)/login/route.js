import {CONNECT_DATABASE, DISCONNECT_DATABASE} from "@/lib/connection/MongoDB";
import User from "@/lib/models/mongoose/UserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
import Cookies from "js-cookie";

export const POST = async (req) => {
    try {
        const { email, password } = await req.json();

        const emailRegex = /^[a-z0-9._-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,63}$/;

        // 1. Validate input
        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // 2. Connect to DB
        await CONNECT_DATABASE();
        const cookieToken = Cookies.get("token");
        if(cookieToken) {
            const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if(user) {
                return;
            }
        }

        // 3. Find user with password field explicitly included
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 4. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 5. Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Set cookie
        (await cookies()).set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({ message: "Login successful" }, { status: 200 });

    } catch (e) {
        console.error("[LOGIN_ERROR]", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }finally {
        await DISCONNECT_DATABASE();
    }
};