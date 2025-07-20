'use client';
import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {SplitText} from "gsap/SplitText";
import Button from "@/components/ui/button";
import Image from "next/image";
import {AtSign, Eye, Key, LogIn, UserPlus} from "lucide-react";
import Login from "@/components/(auth)/Login";
import {useMediaQuery} from "react-responsive";
import Register from "@/components/(auth)/Register";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Mockup = () => {
    const mockupRef = useRef(null);
    const isDeviceSmaller = useMediaQuery({ maxWidth: 768 });
    const [isLoginOpen, setIsLoginOpen] = useState(true);

    useEffect(() => {
        const el = mockupRef.current;
        gsap.fromTo(el,
            { opacity: 0, y: 100, rotate: -12 },
            {
                opacity: 1,
                y: 0,
                rotate: isDeviceSmaller ? 0 : -12,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
    }, []);

    return (
        <div className="flex relative w-full h-full p-4 items-center justify-center mb-3">
            <div
                ref={mockupRef}
                className="
                    w-full h-[450px]
                    md:w-[580px] md:h-[400px]
                    lg:w-[600px] lg:h-[400px]
                    rotate-[0deg]
                    md:-rotate-12
                    dark:bg-zinc-900/60
                    bg-white/60
                    backdrop-blur-lg
                    border dark:border-zinc-700
                    border-[whitesmoke]
                    shadow-2xl rounded-xl
                    overflow-hidden
                    scale-[0.95] hover:scale-100 transition-all duration-500
                    overflow-y-auto
                "
            >
                <div className="mockup-login-example absolute inset-0 p-4  text-sm space-y-3">
                   <div className={"flex items-center justify-between gap-4 flex-wrap w-full"}>
                       <div className={"flex-1 flex items-center justify-start gap-4"}>
                           <span className={`w-8 h-8 bg-gray-200 dark:bg-emerald-600 rounded-full flex items-center justify-center p-2 hover:scale-105 cursor-pointer transition-all duration-500 ${isLoginOpen && "dark:bg-violet-600 bg-violet-400 text-white"}`} onClick={()=> setIsLoginOpen(true)}><LogIn /></span>
                           <span className={`w-8 h-8  bg-gray-200 dark:bg-emerald-600 rounded-full flex items-center justify-center p-2 hover:scale-105 cursor-pointer transition-all duration-500 ${!isLoginOpen && "dark:bg-violet-600 bg-violet-400 text-white"}`} onClick={()=> setIsLoginOpen(false)}><UserPlus /></span>
                       </div>

                       <div className={"flex-1 flex items-center justify-end gap-4"}>
                           <p className={'text-lg -tracking-normal font-semibold'}>ONE ENTRY-{isLoginOpen ? "LOGIN" : "REGISTER"}</p>
                       </div>
                   </div>
                    <hr />
                    {isLoginOpen ? <Login /> : <Register />}
                </div>
            </div>
        </div>
    );
};

export default Mockup;
