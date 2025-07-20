'use client';

import {useEffect, useRef} from "react";
import gsap from 'gsap';

const AnimatedGrid = ({ className = "" }) => {
    const gridRef = useRef(null);

    useEffect(()=> {
        const lines = gridRef.current?.querySelectorAll('.line');

        if(lines) {
            const linesTimeline = gsap.timeline();

            gsap.fromTo(lines, {
                opacity: 0,
                y: -10
            },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 1,
                    ease: "power2.out",
                });

            linesTimeline.to(
                lines,{
                    y: 8,
                    repeat: -1,
                    x: 6,
                    yoyo: true,
                    ease: "sine.inOut",
                    duration: 3,
                    delay: 1,
                    stagger: {
                        each: 0.06,
                        from: "center"
                    },
                },
                '+=1.5'
            )
        }
    }, []);
    return (
        <div ref={gridRef} className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
            <svg
                width="100%"
                height="100%"
                className="opacity-20"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Horizontal lines */}
                {[...Array(20)].map((_, i) => (
                    <line
                        key={`h-${i}`}
                        className="line"
                        x1="0"
                        x2="100%"
                        y1={i * 70}
                        y2={i * 70}
                        stroke="#94a3b8"
                        strokeWidth="0.6"
                    />
                ))}
                {/* Vertical lines */}
                {[...Array(20)].map((_, i) => (
                    <line
                        key={`v-${i}`}
                        className="line"
                        x1={i * 70}
                        x2={i * 70}
                        y1="0"
                        y2="100%"
                        stroke="#94a3b8"
                        strokeWidth="0.6"
                    />
                ))}
            </svg>
        </div>
    )
}

export default AnimatedGrid;