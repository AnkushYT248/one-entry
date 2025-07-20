'use client';
import {Hand} from "lucide-react";
import {useAuth} from "@/context/AuthContext";

const GreetHelper = () => {
    const { user } = useAuth();
    return (
        <div className={"space-y-2"}>
            <h2 className={"text-2xl font-bold -tracking-wider flex items-center gap-2"}><Hand/> Hey Mr. {user?.username || "Anonymous"}
            </h2>
            <p className={"text-base font-medium text-accent-foreground/70"}>How are you felling today ?</p>
        </div>
    )
}

export { GreetHelper }