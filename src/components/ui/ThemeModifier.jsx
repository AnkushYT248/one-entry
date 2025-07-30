'use client';
import {Moon, Sun} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const ThemeModifier = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className={"cursor-pointer fixed bottom-5 right-5 z-60 p-2 bg-foreground rounded-lg w-8 h-8 flex items-center justify-center"} onClick={toggleTheme}>
            <div className={"w-full h-full"}>
                { theme === "dark" ? <Sun color={'black'} className={"w-full h-full object-cover"}/> : <Moon color={'white'} className={"w-full h-full object-cover"} /> }
            </div>
        </div>
    )
}

export default ThemeModifier;