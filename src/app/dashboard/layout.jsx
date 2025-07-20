'use client';
import { useState } from "react";
import Sidebar from "@/components/dashboard_component/Sidebar";
import { PanelRight } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/Tooltip";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="relative w-screen h-screen flex transition-all duration-500">
            <Sidebar user={user} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 relative">
                {/* Sidebar Toggle Button */}
                <div className="w-full h-[60px] flex items-center justify-between border-b-2 px-6 py-3 lg:hidden">
                    <Tooltip>
                        <TooltipTrigger>
                            <PanelRight
                                size={20}
                                onClick={toggleSidebar}
                                className="opacity-85 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            {isSidebarOpen ? "Close Menu" : "Open Menu"}
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Main Content */}
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;