'use client'

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const TextAnimated = ({ text, className = "" }) => {
    const textRef = useRef(null);

    useLayoutEffect(() => {
        if (!textRef.current) return;

        const split = new SplitText(textRef.current, { type: "chars" });
        const chars = split.chars;

        gsap.from(chars, {
            opacity: 0,
            y: 20,
            rotateX: 90,
            duration: 1,
            ease: "back.out(1.7)",
            stagger: 0.03,
        });

        chars.forEach((char, i) => {
            char.style.display = "inline-block";
            char.style.wordBreak = "break-word"; // prevent overflow

            char.addEventListener("mouseenter", () => {
                gsap.to(char, {
                    scale: 1.3,
                    transformPerspective: 400,
                    rotate: i % 2 === 0 ? -5 : 5,
                    color: "#484b4b",
                    textShadow: "0 0 8px #6fife9",
                    duration: 0.4,
                    ease: "power2.out",
                    fontFamily: "var(--font-orbitron)",
                    letterSpacing: "0.15em",
                });
            });

            char.addEventListener("mouseleave", () => {
                gsap.to(char, {
                    scale: 1,
                    rotate: 0,
                    transformPerspective: 400,
                    color: "var(--foreground)",
                    textShadow: "none",
                    duration: 0.5,
                    ease: "elastic.out(1.2, 0.4)",
                    fontFamily: "var(--font-sora)",
                    letterSpacing: "0em",
                });
            });
        });

        return () => split.revert();
    }, []);

    return (
        <h2
            ref={textRef}
            className={`
                ${className}
                select-none
                cursor-default
                break-words
                text-center
                mx-auto
                max-w-[90vw]
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                font-bold
                leading-tight
            `}
        >
            {text}
        </h2>
    );
};

export default TextAnimated;
