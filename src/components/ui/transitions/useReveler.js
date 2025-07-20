"use client";

import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";


gsap.registerPlugin(CustomEase);

CustomEase.create("hop", "0.9, 0, 0.1, 1");

export function useReveler() {
    useGSAP(()=> {
        gsap.to('.reveler', {
            scaleX: 0,
            duration: 1.05,
            delay: 0.1,
            ease: "hop",
        })
    }, {})
}