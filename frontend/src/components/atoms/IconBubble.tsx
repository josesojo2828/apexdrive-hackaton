import React from "react";

interface IconBubbleProps {
    children: React.ReactNode;
    colorClass?: string;
    className?: string;
}

export const IconBubble: React.FC<IconBubbleProps> = ({
    children,
    colorClass = "text-brand-sky bg-brand-sky/10",
    className = ""
}) => {
    return (
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(18,44,79,0.1),inset_0_1px_1px_rgba(251,249,228,0.2)] group-hover:scale-110 group-hover:border-brand-sky/50 transition-all duration-500 ${colorClass} ${className}`}>
            <div className="absolute inset-0 rounded-2xl bg-brand-sky/20 transition-opacity opacity-0 group-hover:opacity-100 blur-xl -z-1" />
            <div className="relative z-10 flex items-center justify-center">{children}</div>
        </div>
    );
};
