import { Skeleton } from "@/components/ui/Skeleton";

const SkeletonLoading = () => {
    return (
        <div className="w-full h-full">
            {/* Header Section */}
            <div className="w-full px-4 py-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <Skeleton className="w-24 h-4 rounded-lg" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-12 h-3 rounded-lg" />
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-12 h-3 rounded-lg" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-6 h-6 rounded-full" />
                </div>
            </div>
            <hr />

            {/* Title + Tags */}
            <div className="space-y-4 p-4 w-full">
                <Skeleton className="w-1/3 h-8 rounded-lg" />
                <Skeleton className="w-[30%] h-6 rounded-lg" />

                <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                    <Skeleton className="w-[20%] min-w-[80px] h-6 rounded-lg" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-12 h-6 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-6 p-4 space-y-6">
                <Skeleton className="w-full sm:w-[80%] h-16 rounded-lg mx-auto" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-44 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoading;
