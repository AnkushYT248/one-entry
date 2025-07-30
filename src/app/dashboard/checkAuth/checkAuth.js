'use client';

import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {useEffect} from "react";

const CheckAuth = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return children;
};

export default CheckAuth;