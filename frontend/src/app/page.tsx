"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Header } from "../components/organisms/Header";
import { Hero } from "../components/organisms/Hero";
import { ValueProposition } from "../components/organisms/ValueProposition";
import { Footer } from "../components/organisms/Footer";

import { HowItWorks } from "../components/organisms/HowItWorks";

export default function Home() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white selection:bg-primary/30 selection:text-black">
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <ValueProposition />
        </main>
        <Footer />
      </div>
    </div>
  );
}
