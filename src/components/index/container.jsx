'use client';

import IndexHero from "@/components/index/hero/Hero";
import {useAuth} from "@/context/AuthContext";
import {CosmicLoading} from "@/components/Loading";

const Container = () => {
    const {  isLoading } = useAuth();
    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-hero transition-colors duration-500">
            {isLoading && <CosmicLoading
                size="large"
                ringColor="border-gradient-main"
                coreColor="bg-gradient-accent"
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