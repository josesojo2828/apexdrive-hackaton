"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { FormField } from "./FormField";
import { useRegister } from "../hooks/useRegister";
import { getPasswordStrength } from "../utils/validation";
import { useTranslations } from "next-intl";

export const RegisterForm = () => {
    const t = useTranslations("auth.register");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { handleRegister, isLoading, error, fieldErrors } = useRegister();

    const passwordStrength = password ? getPasswordStrength(password) : null;

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleRegister({
            firstName,
            lastName,
            phone,
            email,
            password,
            confirmPassword,
            acceptTerms,
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4 mt-6">
            {/* Global Error */}
            {error && (
                <div role="alert" className="alert alert-error text-xs rounded-xl">
                    {error}
                </div>
            )}

            {/* Split Name/Lastname */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label={t("name")}
                    type="text"
                    placeholder="NOMBRE"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={fieldErrors.firstName}
                    icon="user"
                    disabled={isLoading}
                    required
                />
                <FormField
                    label={t("name")}
                    type="text"
                    placeholder="APELLIDO"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={fieldErrors.lastName}
                    disabled={isLoading}
                    required
                />
            </div>

            {/* Contact Grid (Email & Phone) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    label={t("email")}
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={fieldErrors.email}
                    icon="mail"
                    disabled={isLoading}
                    required
                />
                <FormField
                    label="Teléfono"
                    type="tel"
                    placeholder="TELÉFONO"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={fieldErrors.phone}
                    icon="phone"
                    disabled={isLoading}
                    required
                />
            </div>

            {/* Password Field with Strength Indicator */}
            <div className="space-y-4">
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

                {/* Password Strength Indicator */}
                {password && passwordStrength && (
                    <div className="space-y-2 px-1">
                        <div className="flex gap-1.5">
                            <div className={`h-1 flex-1 rounded-full bg-black/5 transition-all duration-500 ${passwordStrength.percentage >= 33 ? (passwordStrength.level === "weak" ? "bg-rose-500" : passwordStrength.level === "medium" ? "bg-amber-400" : "bg-primary") : ""}`}></div>
                            <div className={`h-1 flex-1 rounded-full bg-black/5 transition-all duration-500 ${passwordStrength.percentage >= 66 ? (passwordStrength.level === "medium" ? "bg-amber-400" : "bg-primary") : ""}`}></div>
                            <div className={`h-1 flex-1 rounded-full bg-black/5 transition-all duration-500 ${passwordStrength.percentage >= 90 ? "bg-primary" : ""}`}></div>
                        </div>
                    </div>
                )}

                <FormField
                    label={t("confirm")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="CONFIRMAR PASSWORD"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={fieldErrors.confirmPassword}
                    icon="lock"
                    showPasswordToggle
                    showPassword={showConfirmPassword}
                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    required
                />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2 px-1 py-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="checkbox checkbox-xs border-black/10 transition-all checked:bg-black"
                        disabled={isLoading}
                    />
                    <span className="text-[9px] font-black uppercase tracking-wider text-black/30 group-hover:text-black transition-colors leading-tight">
                        Acepto los términos y condiciones de la plataforma Hackathon 2026.
                    </span>
                </label>
                {fieldErrors.acceptTerms && (
                    <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest px-1">{fieldErrors.acceptTerms}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="PRIMARY"
                size="LG"
                className="w-full h-12 bg-black text-white rounded-xl group"
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

            {/* Login Link */}
            <div className="text-center pt-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/20">
                    {t("has_account")}{" "}
                    <Link
                        href="/login"
                        className="text-black hover:underline decoration-2 underline-offset-4"
                    >
                        {t("login")}
                    </Link>
                </p>
            </div>
        </form>
    );
};
