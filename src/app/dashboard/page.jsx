import {Hand, LayoutDashboard, LinkIcon, PanelRight, PlusCircle, Settings} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/Tooltip";
import MoodTracker from "@/components/ui/MoodTracker";
import Journey from "@/components/dashboard_component/Journey";
import {GreetHelper} from "@/components/helper/GreetHelper";

const Page = () => {
    const now = new Date();
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const formattedDate = new Intl.DateTimeFormat('en-IN', dateOptions).format(now);
    const finalString = `Today: ${formattedDate}`;


    return (
        <div className={"relative h-screen overflow-y-auto overflow-x-hidden flex-1"}>
            <div className={"w-full h-[60px] flex items-center justify-between border-b-2 px-6 py-3"}>
                <div className={"flex-1 flex items-center gap-3"}>

                    <p className={"text-balance text-sm font-medium flex items-center gap-2"}><LayoutDashboard
                        size={15}/> Dashboard</p>
                    •
                    <button
                        className={"btn-primary flex items-center gap-2 px-2 py-1 hover:bg-[#407566] hover:text-white transition-colors duration-300 rounded-lg text-sm"}>
                        <PlusCircle size={17}/> New Journal</button>
                </div>

                <div className={"flex items-center gap-4"}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Settings size={16}
                                      className={"opacity-85 hover:opacity-100 transition-opacity duration-300 cursor-pointer hidden lg:block"}/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Settings
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger>
                            <LinkIcon size={16}
                                      className={"opacity-85 hover:opacity-100 transition-opacity duration-300 cursor-pointer"}/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Create Shared Link
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <section className={"flex flex-col gap-3 px-4 py-5"}>
                <GreetHelper />

                <div className={"flex items-center justify-center flex-col"}>
                    <h2>{finalString}</h2>
                    <MoodTracker/>
                </div>

                <Journey />
            </section>
        </div>
    );
};

export default Page;