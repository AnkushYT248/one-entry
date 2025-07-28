'use client';
import { LayoutDashboard, LinkIcon, PlusCircle, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import { usePathname } from "next/navigation";

const Dashboard_Header = () => {
    const pathname = usePathname();

    // Determining the correct segment to display based on pathname structure
    const splitPath = pathname.split("/");
    const routeName =
        splitPath.length === 2
            ? splitPath[1] // If "/dashboard", use the second segment (index 1)
            : splitPath[splitPath.length - 1]; // Otherwise, use the last part

    return (
        <div className="w-full h-[60px] flex items-center justify-between border-b-2 px-6 py-3">
            <div className="flex-1 flex items-center gap-3">
                <p className="text-balance text-sm font-medium flex items-center gap-2">
                    <LayoutDashboard size={15} />
                    {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
                </p>
                •
                <button
                    className="btn-primary flex items-center gap-2 px-2 py-1 hover:bg-[#407566] hover:text-white transition-colors duration-300 rounded-lg text-sm"
                >
                    <PlusCircle size={17} /> New Journal
                </button>
            </div>

            <div className="flex items-center gap-4">
                <Tooltip>
                    <TooltipTrigger>
                        <Settings
                            size={16}
                            className="opacity-85 hover:opacity-100 transition-opacity duration-300 cursor-pointer hidden lg:block"
                        />
                    </TooltipTrigger>
                    <TooltipContent>Settings</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <LinkIcon
                            size={16}
                            className="opacity-85 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        />
                    </TooltipTrigger>
                    <TooltipContent>Create Shared Link</TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};

export default Dashboard_Header;