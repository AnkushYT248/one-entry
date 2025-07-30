import CheckAuth from "@/app/dashboard/checkAuth/checkAuth";
import DashboardClient from "@/app/dashboard/DashboardClient";

export const metadata = {
    title: "One Entry | Dashboard",
    description: "One Entry Dashboard – Understand yourself better, one mood at a time.",
};

const Page = () => {
    return (
        <CheckAuth>
            <DashboardClient />
        </CheckAuth>
    );
};

export default Page;
