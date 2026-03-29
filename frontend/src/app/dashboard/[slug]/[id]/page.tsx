"use client";

import { useParams } from "next/navigation";
import { useEntityDetail } from "@/features/dashboard/hooks/useEntityDetail";
import EntityDetailFactory from "@/services/factory/EntityDetailFactory";
import Link from "next/link";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { motion } from "framer-motion";

export default function EntityPage() {
    const params = useParams();
    const slug = params.slug as string;
    const id = params.id as string;

    const { data, loading, refresh } = useEntityDetail(slug, id);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="text-[10px] font-black text-white/20 animate-pulse tracking-[0.8em] uppercase">
                    Accessing_Encrypted_Data...
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-12 max-w-[1800px] mx-auto space-y-12 transition-all duration-700">
            {/* Header Navigation */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-8 py-6 border-b border-white/5"
            >
                <Link
                    href={`/dashboard/${slug}`}
                    className="p-5 bg-white text-black rounded-2xl hover:bg-primary transition-all active:scale-95 shadow-xl group"
                >
                    <DynamicIcon name="ArrowLeft" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em] block mb-1 underline decoration-primary/30 underline-offset-4">Security Protocol Active</span>
                    <span className="text-sm font-black text-white uppercase italic tracking-[0.2em]">
                        DATA_VAULT / {slug.toUpperCase()} / <span className="text-primary italic-heavy">#{id.slice(-6).toUpperCase()}</span>
                    </span>
                </div>
            </motion.nav>

            {/* Renderizado Dinámico */}
            <EntityDetailFactory slug={slug} id={id} />
        </div>
    );
}