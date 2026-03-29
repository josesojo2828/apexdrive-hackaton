"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { FormField } from "./FormField";
import { useLogin } from "../hooks/useLogin";
import { useTranslations } from "next-intl";

export const LoginForm = () => {
    const t = useTranslations("auth.login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { handleLogin, isLoading, error, fieldErrors } = useLogin();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleLogin({ email, password, rememberMe });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 mt-8">
            {/* Global Error */}
            {error && (
                <div role="alert" className="alert alert-error text-sm">
                    {error}
                </div>
            )}

            {/* Email Field */}
            <FormField
                label={t("email")}
                type="email"
                placeholder="CORREO"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                icon="mail"
                disabled={isLoading}
                required
            />

            {/* Password Field */}
            <FormField
                label={t("password")}
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                icon="lock"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="checkbox checkbox-xs border-black/[0.1] transition-all checked:bg-black"
                        disabled={isLoading}
                    />
                    <span className="text-[9px] font-black uppercase tracking-wider text-black/20 group-hover:text-black transition-colors">{t("remember")}</span>
                </label>
                <Link
                    href="/recuperar-password"
                    className="text-[9px] font-black uppercase tracking-wider text-black/20 hover:text-black transition-all border-b border-transparent hover:border-black"
                >
                    {t("forgot")}
                </Link>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="PRIMARY"
                size="LG"
                className="w-full h-12 rounded-xl bg-black text-white hover:bg-black/90 border-0 group transition-all active:scale-95"
                isLoading={isLoading}
                disabled={isLoading}
            >
                <div className="flex items-center justify-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                        {isLoading ? t("loading") : t("button")}
                    </span>
                    {!isLoading && <div className="w-1 h-1 rounded-full bg-white group-hover:scale-[3] transition-transform duration-500" />}
                </div>
            </Button>

            {/* Register Link */}
            <div className="text-center pt-4">
                <Typography variant="P" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {t("no_account")}{" "}
                    <Link
                        href="/registro"
                        className="text-black hover:underline decoration-2 underline-offset-4 transition-all"
                    >
                        {t("register")}
                    </Link>
                </Typography>
            </div>
        </form>
    );
};
