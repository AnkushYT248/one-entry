import Link from "next/link";

const LinkItems = ({
                       children,
                       title,
                       icon,
                       className = "",
                       href = "#",
                       size = "sm",
                       textColor = "",
                       hoverBg = "hover:bg-accent-foreground hover:text-accent ",
                       activeClass = "",
                       isExternal = false,
                       onClick,
                   }) => {
    return isExternal ? (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className={`text-${size} ${textColor} ${icon ? "flex items-center gap-3" : ""} p-2 ${hoverBg} transition-colors duration-300 ease-in-out ${className} ${activeClass}`}
        >
            {icon}
            {title}
            {children}
        </a>
    ) : (
        <Link
            href={href}
            onClick={onClick}
            className={`text-${size} ${textColor} ${icon ? "flex items-center gap-3" : ""} p-2 ${hoverBg} transition-colors duration-300 ease-in-out ${className} ${activeClass}`}
        >
            {icon}
            {title}
            {children}
        </Link>
    );
};

export default LinkItems;