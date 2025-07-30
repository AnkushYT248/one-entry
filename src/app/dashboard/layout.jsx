'use client';
import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard_component/Sidebar";
import { PanelRight } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/Tooltip";
import { useAuth } from "@/context/AuthContext";
import SkeletonLoading from "@/components/dashboard_component/loading/SkeletonLoading";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);


    return (
        <div className="relative w-screen h-screen flex">
            <nav aria-label="Sidebar navigation">
                <Sidebar user={user} isOpen={isSidebarOpen}  isLoading={isLoading} toggleSidebar={toggleSidebar} />
            </nav>
            
            <div className="flex-1 relative">
                {/* Sidebar Toggle Button */}
                <header className="w-full h-[60px] flex items-center justify-between border-b-2 px-6 py-3 lg:hidden bg-gradient-accent/80 dark:bg-gradient-hero/80 shadow-md" aria-label="Dashboard top bar">
                    <Tooltip>
                        <TooltipTrigger>
                            <PanelRight
                                size={20}
                                onClick={toggleSidebar}
                                className="opacity-85 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                                aria-pressed={isSidebarOpen}
                                role="button"
                                tabIndex={0}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            {isSidebarOpen ? "Close Menu" : "Open Menu"}
                        </TooltipContent>
                    </Tooltip>
                </header>

                {
                    isLoading ? <div role="status" aria-live="polite"><SkeletonLoading /></div> : children
                }
            </div>
        </div>
    );
};

export default DashboardLayout;