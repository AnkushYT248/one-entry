const TextProfile = ({
                         content = "TP",
                         size = "base",
                         bg = "bg-emerald-600",
                         radius = "rounded-2xl",
                         textColor = "text-white",
                         fontWeight = "font-bold",
                         customClass = "",
                     }) => {
    return (
        <div
            className={`${bg} ${radius} ${textColor} ${fontWeight} text-${size} flex items-center justify-center px-2 py-1 ${customClass}`}
        >
            {content}
        </div>
    );
};

export default TextProfile;