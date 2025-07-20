'use client';

import IndexHero from "@/components/index/hero/Hero";
import {useAuth} from "@/context/AuthContext";
import {CosmicLoading} from "@/components/Loading";
import Link from "next/link";
import {useEffect} from "react";

const Container = () => {
    const {  isLoading, user } = useAuth();
    useEffect(() => {
        console.log(user)
    }, [user]);
    return (
        <main>
            {isLoading && <CosmicLoading
                size="large"
                ringColor="border-green-600"
                coreColor="bg-white"
                speed="spin-fast"
                position="fixed"
                float="top-right"
                className="m-4"
                borderSize={4}
            /> }
            <IndexHero />
        </main>
    )
}

export default Container;