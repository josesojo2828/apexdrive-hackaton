"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    const { isAuthenticated, _hasHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (_hasHydrated && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [_hasHydrated, isAuthenticated, router]);

    const t = useTranslations("auth.login");

    return (
        <AuthLayout
            title={t("title")}
            subtitle="Premium vehicle access portal"
        >
            <LoginForm />
        </AuthLayout>
    );
}
