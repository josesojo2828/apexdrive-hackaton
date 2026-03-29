"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/utils/api/api.client";
import { IApplicationSocialMedia } from "@/types/application/social-media";

export const SocialMedia = () => {
    const [socialLinks, setSocialLinks] = useState<IApplicationSocialMedia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSocial = async () => {
            try {
                // El backend usa paginación o devuelve el array directo
                const res = await apiClient.get('/social-media');
                const body = res.data?.body || res.data;
                const data = (body?.data || body || []) as IApplicationSocialMedia[];
                setSocialLinks(data);
            } catch (error) {
                console.error("Error fetching social media:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSocial();
    }, []);

    const displayLinks = socialLinks;

    if (loading && socialLinks.length === 0) return (
        <div className="flex gap-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="flex flex-wrap gap-4">
            {displayLinks.map((social) => (
                <Link
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-11 h-11 rounded-xl bg-white/5 dark:bg-brand-blue/40 border border-white/10 flex items-center justify-center group transform hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-[0_0_20px_rgba(91,136,178,0.3)] overflow-hidden"
                >
                    {/* Glass Glow Backdrop on Hover */}
                    <div className="absolute inset-0 bg-brand-sky/20 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />

                    <Image
                        src={`/icons/svg/${social.icon}.svg`}
                        alt={social.name}
                        width={20}
                        height={20}
                        className="relative z-10 w-5 h-5 opacity-70 group-hover:opacity-100 transition-all group-hover:translate-y-[-2px]"
                        unoptimized
                    />
                </Link>
            ))}
        </div>
    );
};
