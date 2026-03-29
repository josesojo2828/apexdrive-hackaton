"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { useTranslations } from "next-intl";
import { Car } from "lucide-react";

import { Logo } from "@/components/atoms/Logo";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    const t = useTranslations("auth.layout");
    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-white overflow-hidden text-black transition-all">
            {/* Background Editorial Grids */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/[0.03]" />
            <div className="absolute inset-y-0 left-1/4 w-[1px] bg-black/[0.03]" />
            <div className="absolute inset-y-0 right-1/4 w-[1px] bg-black/[0.03]" />

            <div className="relative z-10 w-full max-w-[1700px] mx-auto flex flex-col min-h-[90vh]">
                {/* Header Section */}
                <div className="w-full flex justify-between items-center mb-12 px-10">
                    <Link href="/" className="flex items-center gap-4 group">
                        <Logo className="w-10 h-10" variant="light" />
                        <span className="text-xl font-black text-black tracking-[0.4em] leading-none uppercase serif">ApexDrive</span>
                    </Link>

                    <Link href="/">
                        <Button
                            variant="GHOST"
                            size="SM"
                            className="text-[10px] font-black uppercase tracking-[0.4em] border-b border-black/10 hover:border-black transition-all"
                        >
                            {t("back_to_home")}
                        </Button>
                    </Link>
                </div>

                {/* Main Content: Editorial Split */}
                <div className="flex-1 grid lg:grid-cols-2 gap-20 items-center px-10">
                    {/* Left: Branding/Editorial (Administrative Message) */}
                    <div className="hidden lg:flex flex-col justify-center space-y-16">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-8xl font-black text-black leading-[0.8] tracking-tighter uppercase serif transition-all">
                                Administrative<br />
                                <span className="italic block text-black/10">Access</span>
                            </h1>
                        </div>
                    </div>

                    {/* Right: Boxed Form Container (Functional & Clean) */}
                    <div className="flex justify-center w-full">
                        <div className="w-full max-w-lg bg-white border border-black/5 p-10 md:p-14 shadow-2xl rounded-3xl relative overflow-hidden transition-all">
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-black italic serif leading-tight tracking-tight">{title}</h2>
                                    <p className="text-[11px] font-bold text-black/40 uppercase tracking-[0.2em]">{subtitle}</p>
                                </div>

                                <div className="w-full bg-slate-200/50 h-[1px]" />

                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
