import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/models/mongoose/UserModel";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { CONNECT_DATABASE } from "@/lib/connection/MongoDB";
import GithubProvider from "next-auth/providers/github";

// Configure NextAuth
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET_KEY,
        }),
    ],

    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                await CONNECT_DATABASE();

                const existing = await User.findOne({ email: user.email });
                let dbUser = existing;

                if (!existing) {
                    const randomPassword = crypto.randomBytes(16).toString("hex");
                    const hashedPassword = bcrypt.hashSync(randomPassword, 10);

                    dbUser = await User.create({
                        email: user.email,
                        username: user.name,
                        password: hashedPassword,
                        profile: {
                            avatar: user.image,
                        },
                        authProvider: [account.provider],
                        isVerified: true,
                    });
                }

                if(!dbUser.authProvider.includes(account.provider)) {
                    dbUser.authProvider.push(account.provider);
                    if(!dbUser.isVerified) {
                        dbUser.isVerified = true;
                        dbUser.lastLogin = new Date();
                    }
                    await dbUser.save();
                }

                const token = jwt.sign(
                    { id: dbUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );

                cookies().set("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                });

                return true;
            } catch (err) {
                console.error("Error in signIn callback:", err);
                return false;
            }
        },

        async jwt({ token, user }) {
            return token;
        },
        async session({ session, token }) {
            return session;
        },

    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };