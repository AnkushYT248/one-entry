'use client';

import { useRef } from 'react';
import {useGSAP} from "@gsap/react";
import gsap from 'gsap';

const AnimatedHexGrid = ({ size = 30, container_width, container_height }) => {
    const gridRef = useRef(null);
    const svgRef = useRef(null);

    const hexHeight = Math.sqrt(3) * size;
    const hexWidth = size * 2;
    const horizSpacing = 0.75 * hexWidth;
    const vertSpacing = hexHeight;

    const cols = Math.ceil(container_width / horizSpacing) + 1;
    const rows = Math.ceil(container_height / vertSpacing) + 1;

    const hexes = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * horizSpacing;
            const y = row * vertSpacing + (col % 2 === 1 ? vertSpacing / 2 : 0);

            const path = hexagonPath(x, y, size);

            hexes.push(
                <g
                    key={`${row}-${col}`}
                    className="hex-group"
                    onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, {
                            y: -10,
                            scale: 1.4,
                            transformOrigin: "center",
                            duration: 0.4,
                            ease: 'power3.out',
                        });
                    }}
                    onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, {
                            y: 0,
                            scale: 1,
                            duration: 0.4,
                            ease: 'power3.inOut',
                        });
                    }}
                >
                    <path
                        d={path}
                        className="hex-line"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="0.6"
                    />
                </g>
            );
        }
    }

   useGSAP(() => {
       if (!svgRef.current) return;
       const hex_groups = document.querySelectorAll('.hex-group');
       if (hex_groups.length > 0) {
           const tl = gsap.timeline();

           gsap.fromTo(
               hex_groups,
               { opacity: 0, y: -10 },
               { opacity: 1, y: 0, stagger: 0.02, duration: 0.4, ease: 'power2.out' }
           );

           const randomYAxis = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
           const randomXAxis = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

           tl.to(
               hex_groups,
               {
                   y: randomYAxis,
                   x: randomXAxis,
                   repeat: -1,
                   yoyo: true,
                   ease: 'sine.inOut',
                   duration: 2,
                   stagger: { each: 0.05, from: 'center' },
               },
           );
       }
   }, []);

    return (
        <div ref={gridRef} className="absolute inset-0 z-0">
            <svg
                width={container_width}
                height={container_height}
                viewBox={`0 0 ${container_width} ${container_height}`}
                className="opacity-30"
                ref={svgRef}
            >
                {hexes}
            </svg>
        </div>
    );

};

function hexagonPath(x, y, size) {
    const angle = (Math.PI / 180) * 60;
    return (
        Array.from({ length: 6 })
            .map((_, i) => {
                const px = +(x + size * Math.cos(angle * i)).toFixed(2);
                const py = +(y + size * Math.sin(angle * i)).toFixed(2);
                return `${i === 0 ? 'M' : 'L'}${px},${py}`;
            })
            .join(' ') + ' Z'
    );
}

export default AnimatedHexGrid;