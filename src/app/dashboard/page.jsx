import {Hand, LayoutDashboard, LinkIcon, PanelRight, PlusCircle, Settings} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/Tooltip";
import MoodTracker from "@/components/ui/MoodTracker";
import Journey from "@/components/dashboard_component/Journey";
import {GreetHelper} from "@/components/helper/GreetHelper";
import Dashboard_Header from "@/components/dashboard_component/Dashboard_Header";

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
            <Dashboard_Header />
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