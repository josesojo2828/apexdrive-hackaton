"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
    const { isAuthenticated, _hasHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (_hasHydrated && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [_hasHydrated, isAuthenticated, router]);

    return (
        <AuthLayout
            title="Únete a Speed Delivery"
            subtitle="Crea tu cuenta gratis en minutos"
        >
            <RegisterForm />
        </AuthLayout>
    );
}
