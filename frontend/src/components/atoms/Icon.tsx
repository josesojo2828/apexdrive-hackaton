import React from "react";
import { LucideProps } from "lucide-react";
import { ICONS, IconName } from "@/config/icons";

export interface IconProps extends Omit<LucideProps, "ref"> {
    icon: any;
}

export const Icon = ({ icon, className, ...props }: IconProps): React.JSX.Element | null => {
    const IconComponent = typeof icon === "string" ? (ICONS as any)[icon] : icon;

    if (!IconComponent) {
        console.warn(`Icon "${icon}" not found in registry.`);
        return null;
    }

    return <IconComponent className={className} {...props} />;
};
