import React from 'react';
import { cn } from "@/utils/cn";

interface LogoProps {
    className?: string;
    variant?: 'light' | 'dark';
}

export const Logo = ({ className, variant = 'light' }: LogoProps) => {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <svg 
                width="40" 
                height="40" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Shield Base */}
                <path 
                    d="M50 5L90 20V45C90 70 73 88 50 95C27 88 10 70 10 45V20L50 5Z" 
                    fill={variant === 'dark' ? "white" : "black"} 
                />
                
                {/* Accent Line (Inner Precision) */}
                <path 
                    d="M50 15L82 27V45C82 65 68 81 50 87C32 81 18 65 18 45V27L50 15Z" 
                    className={variant === 'dark' ? "fill-black/20" : "fill-white/20"}
                />

                {/* The "A" shape (Geometric) */}
                <path 
                    d="M50 30L65 65H58L50 45L42 65H35L50 30Z" 
                    className="fill-primary"
                />
                
                {/* Precision Dot */}
                <circle cx="50" cy="72" r="3" className="fill-primary animate-pulse" />
            </svg>
        </div>
    );
};
