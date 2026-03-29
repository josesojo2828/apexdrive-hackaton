"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AboutHero } from "@/components/organisms/AboutHero";
import { MissionVision } from "@/components/organisms/MissionVision";
import { ValuesGrid } from "@/components/organisms/ValuesGrid";
import { ObjectivesTimeline } from "@/components/organisms/ObjectivesTimeline";
import { CTASection } from "@/components/organisms/CTASection";
import apiClient from "@/utils/api/api.client";
import { TranslatableField } from "@/features/dashboard/hooks/useLocalTranslation";

export default function AboutPage() {
    const [aboutData, setAboutData] = useState<{ mision: TranslatableField; vision: TranslatableField } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch About data (Mission/Vision)
        apiClient.get('/about')
            .then(res => {

                console.log(res.data);

                setAboutData(res.data.body.data[0]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (loading) return;

        // Reveal animations after content is rendered
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [aboutData, loading]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#eef2f5] dark:bg-slate-950">
            <Header />
            <main className="relative z-10">
                <AboutHero />

                {!loading && aboutData && (
                    <MissionVision
                        mision={aboutData.mision}
                        vision={aboutData.vision}
                    />
                )}

                <ValuesGrid />
                <ObjectivesTimeline />

                <div className="reveal">
                    <CTASection />
                </div>
            </main>
            <Footer />
        </div>
    );
}
