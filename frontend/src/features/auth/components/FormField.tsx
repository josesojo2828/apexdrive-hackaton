import { InputHTMLAttributes } from "react";
import { Icon } from "@/components/atoms/Icon";
import { IconName } from "@/config/icons";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: any;
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
    showPassword?: boolean;
}

export const FormField = ({
    label,
    error,
    icon,
    showPasswordToggle,
    onTogglePassword,
    showPassword,
    className = "",
    ...props
}: FormFieldProps) => {
    return (
        <fieldset className="fieldset w-full space-y-1.5">
            <div className="relative group/field">
                {/* Icon */}
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-black transition-colors pointer-events-none z-10">
                        <Icon icon={icon} className="w-4 h-4" />
                    </div>
                )}

                {/* Input */}
                <input
                    className={`
                        w-full h-12 bg-white border border-black/5 rounded-xl font-sans text-xs text-black placeholder:text-slate-300
                        focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5
                        transition-all duration-300
                        ${icon ? "pl-12" : "px-5"}
                        ${showPasswordToggle ? "pr-12" : "px-5"}
                        ${error ? "border-error focus:ring-error/5" : ""}
                        ${className}
                    `}
                    {...props}
                />

                {/* Password Toggle */}
                {showPasswordToggle && onTogglePassword && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
                    >
                        <Icon icon={showPassword ? "eye-off" : "eye"} className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-[10px] text-error font-black uppercase tracking-widest flex items-center gap-1.5 px-1 py-1 animate-fade-in">
                    <Icon icon="alert-circle" className="w-3.5 h-3.5" />
                    {error}
                </p>
            )}
        </fieldset>
    );
};

