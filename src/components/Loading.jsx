import { clsx } from "clsx";

export const CosmicLoading = ({
                                  size = "default",
                                  ringColor = "border-blue-500",
                                  coreColor = "bg-blue-500",
                                  speed = "spin-slow",
                                  className = "",
                                  position = "relative",
                                  float = "bottom-right",
                                  borderSize = 4,
                              }) => {
    const sizes = {
        small: "w-6 h-6 border-2",
        default: "w-10 h-10 border-2",
        large: "w-12 h-12 border-4",
        xlarge: "w-16 h-16 border-4",
    };

    const coreSizes = {
        small: "w-2 h-2",
        default: "w-3 h-3",
        large: "w-4 h-4",
        xlarge: "w-5 h-5",
    };

    const resolvedPosition = typeof position === 'string' ? position.trim().toLowerCase() : 'relative';



    const floatClasses = {
        "top-left": "top-0 left-0",
        "top-right": "top-0 right-0",
        "bottom-left": "bottom-0 left-0",
        "bottom-right": "bottom-0 right-0",
        "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    };

    const positionClass = resolvedPosition === "fixed" || resolvedPosition === "absolute"
        ? `${resolvedPosition} ${floatClasses[float] || ""}`
        : resolvedPosition;

    return (
        <div
            className={clsx(
                `flex items-center justify-center z-50 ${positionClass}`,
                position === "fixed" || position === "absolute" ? floatClasses[float] : "",
                className
            )}
        >
            {/* Spinning Ring */}
            <div
                className={clsx(
                    `rounded-full border-[${borderSize}px] border-t-transparent border-l-transparent animate-spin`,
                    ringColor,
                    speed,
                    sizes[size]
                )}
            />
            {/* Core Circle */}
            <div
                className={clsx(
                    "absolute rounded-full",
                    coreColor,
                    coreSizes[size]
                )}
            />
        </div>
    );
};
