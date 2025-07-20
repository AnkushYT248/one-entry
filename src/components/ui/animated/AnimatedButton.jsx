'use client';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';

const AnimatedButton = ({
                            href = "#",
                            children = "Get Started",
                            className = "",
                            bgColor = "#1e1e2f",
                            gradientFrom = "#65659e",
                            gradientTo = "#5a5a68",
                            size = "md", // "sm", "md", "lg"
                            radius = "10px",
                        }) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses = {
        sm: "px-3 py-1 text-sm",
        md: "px-6 py-2 text-base",
        lg: "px-8 py-3 text-lg",
    };

    return (
        <Link
            href={href}
            className={clsx(
                "relative overflow-hidden font-bold  cursor-pointer z-0",
                sizeClasses[size],
                className
            )}
            style={{ borderRadius: radius }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Conic gradient layer */}
            <span
                className="animated-bg absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/6 -translate-y-1/6 z-[-1]"
                style={{
                    borderRadius: radius,
                    background: `conic-gradient(${gradientFrom} 0deg, ${gradientTo} 360deg)`,
                    animationDirection: isHovered ? "reverse" : "normal",
                }}
            ></span>

            {/* Inner solid layer */}
            <span
                className="absolute inset-[3px] z-[-1]"
                style={{ backgroundColor: bgColor, borderRadius: radius }}
            ></span>

            {children}
        </Link>
    );
};

export default AnimatedButton;
