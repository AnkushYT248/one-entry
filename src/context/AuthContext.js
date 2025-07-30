'use client';

import { createContext, useContext, useEffect, useState, useRef } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // This prevents refetch on client-side route changes
    const alreadyFetched = useRef(false);

    const fetchUser = async () => {
        // If already fetched once in this session, don't fetch again
        if (alreadyFetched.current) return;

        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        alreadyFetched.current = true;
        setIsLoading(true);

        try {
            const res = await fetch('/api/user/me', {
                method: "GET",
                headers: {
                    'authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_API_KEY}`
                },
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                setUser(null);
                setIsAuthenticated(false);
                setError(data.error || "Something went wrong");
                return;
            }

            setUser(data.user);
            setIsAuthenticated(true);
            setError(null);
        } catch (err) {
            console.error("Auth fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Soft-refresh: only runs once unless user reloads the tab
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            error,
            refetchData: () => {
                alreadyFetched.current = false;
                fetchUser();
            }
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
