'use client'
import Mockup from "@/components/index/hero/Mockup";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {useRef} from "react";
import {SplitText} from "gsap/SplitText";
import Link from "next/link";
import AnimatedButton from "@/components/ui/animated/AnimatedButton";
import {useTheme} from "@/context/ThemeContext";
import Button from "@/components/ui/button";
import {GalleryThumbnails, LayoutDashboard, MoveRight, UserPlus, Zap} from "lucide-react";
import {useAuth} from "@/context/AuthContext";

gsap.registerPlugin(SplitText);

const IndexHero = () => {
    const {theme} = useTheme();
    const heroTextRef = useRef(null);
    const lightningRef = useRef(null);
    const { isAuthenticated } = useAuth();

    useGSAP(() => {
        const tl = gsap.timeline();
        const heroText = heroTextRef.current;

        if (!heroText) return;

        const heroTextChar = new SplitText(heroText, {type: "chars"});
        const chars = heroTextChar.chars;

        tl.from(chars, {
            opacity: 0,
            y: 20,
            rotateX: 90,
            duration: 1,
            ease: "back.out(1.7)",
            stagger: 0.03,
            delay: 0.5
        });

        tl.fromTo(lightningRef.current, {
            opacity: 0,
            y: -50,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
        })

        tl.fromTo('.hero-line-1', {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "+=0.2");

        tl.fromTo('.hero-line-2', {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "+=0.2");
    }, []);

    return (
        <div className="flex items-center flex-col 2xl:flex-row 2xl:items-start gap-4 mt-10 p-4">
            <div className="flex-1 flex items-center 2xl:items-start flex-col justify-center text-center xl:text-left">
                <div className={"relative w-full"}>
                    <h1 className="text-[2.75rem] text-wrap sm:text-[3.5rem] font-bold -tracking-[0.05rem] heroText text-center 2xl:text-left"
                        ref={heroTextRef}>
                        Modern, quick, and intuitive.
                    </h1>

                    <Zap className={"absolute -top-2 left-[9.5%] w-1/2"} ref={lightningRef}/>
                </div>

                <p className="text-xl sm:text-2xl mt-3 hero-line-1">
                    Here you can
                    <span
                        className="bg-gradient-to-l from-blue-600 to-emerald-700 bg-clip-text text-transparent font-semibold"> Track</span>,
                    <span
                        className="bg-gradient-to-l from-green-600 to-yellow-500 bg-clip-text text-transparent font-semibold"> Create</span>,
                    and
                    <span
                        className="bg-gradient-to-l from-orange-600 to-violet-700 bg-clip-text text-transparent font-semibold"> Delete</span>
                </p>

                <p className="text-lg sm:text-xl mt-1 hero-line-2">
                    your Daily Progress, Special Events, and get updates via email or SMS.
                </p>

                <div className={"space-y-4 mt-4"}>
                    <div className={"flex items-center gap-5 flex-wrap justify-center"}>
                        <AnimatedButton
                            href="/about"
                            size="lg"
                            bgColor={theme === "dark" ? "#ffffff" : "#5a5ab7"}
                            gradientFrom="#f2709c"
                            gradientTo="#ff9472"
                            className="shadow-lg dark:text-black text-white flex items-center gap-4"
                        >
                            <MoveRight/> Explore Now
                        </AnimatedButton>

                        <Button variant={"primary"} size={"lg"} href={isAuthenticated ? "/dashboard" : "#auth_form"} className={"shadow-lg rounded-4xl"}
                                icon={isAuthenticated ? <LayoutDashboard /> : <UserPlus />} iconPosition={"left"}>{isAuthenticated ? "Go to dashboard" : "Sign Up"}</Button>
                    </div>
                </div>

                <div className={"space-y-4 w-full lg:w-[80%] 2xl:w-[70%] mt-5 2xl:mt-4"}>
                    <h2 className={"text-lg font-medium leading-snug -tracking-normal"}>Perfect for individuals who
                        strive to work efficiently and effectively, our focus journal is designed to elevate your
                        productivity with an intuitive and user-friendly interface. Experience a seamless workflow with
                        advanced features that keep you organized, motivated, and engaged—ensuring you never lose focus
                        or feel bored while achieving your goals.
                    </h2>
                </div>
            </div>

            <div className="h-max relative mt-10 w-screen lg:w-auto" id={"auth_form"}>
                <Mockup/>
            </div>
        </div>
    );
};

export default IndexHero;
