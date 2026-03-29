export const UI = {
    /** DaisyUI button variant modifier classes (used alongside `btn` base) */
    COLORS: {
        PRIMARY: "btn-primary",
        SECONDARY: "btn-secondary",
        SUCCESS: "btn-success",
        ERROR: "btn-error",
        WARNING: "btn-warning",
        INFO: "btn-info",
        OUTLINE: "btn-outline",
        GHOST: "btn-ghost",
        PREMIUM: "bg-gradient-to-r from-brand-blue to-brand-sky text-white dark:text-brand-white shadow-[0_8px_20px_rgba(18,44,79,0.3),inset_0_2px_2px_rgba(251,249,228,0.4)] border border-brand-blue/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300",
        RACING_RED: "bg-brand-racing-red text-white shadow-lg shadow-brand-racing-red/20 border-b-4 border-black/20 hover:border-b-0 hover:translate-y-[2px] active:scale-[0.98] transition-all duration-200",
        GOLD: "bg-gradient-to-r from-brand-gold to-[#a48143] text-white shadow-xl shadow-brand-gold/10 hover:shadow-brand-gold/20 hover:scale-[1.05] transition-all duration-300",
        GLASS: "bg-brand-white/10 dark:bg-black/10 hover:bg-brand-white/20 dark:hover:bg-black/20 text-brand-blue dark:text-brand-white border-brand-blue/20 dark:border-white/20 backdrop-blur-md transition-all duration-300",
    },
    /** DaisyUI button size modifier classes (used alongside `btn` base) */
    SIZES: {
        XS: "btn-xs",
        SM: "btn-sm",
        MD: "btn-md",
        LG: "btn-lg",
        XL: "px-8 py-4 text-lg",
        FULL: "btn-wide btn-md",
    },
    INPUT: {
        /** DaisyUI input base class */
        BASE: "input",
        SIZES: {
            SM: "input-sm",
            MD: "input-md",
            LG: "input-lg",
            XL: "px-5 py-4 rounded-2xl",
        },
        VARIANTS: {
            DEFAULT: "",
            ERROR: "input-error",
            SUCCESS: "input-success",
            GLASS: "bg-white/80 border-slate-200 focus:ring-2 focus:ring-brand-sky/50 focus:outline-none transition-shadow",
        },
    },
    TYPOGRAPHY: {
        DISPLAY: "text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] uppercase",
        H1: "text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05]",
        H2: "text-4xl md:text-6xl font-black tracking-tight",
        H3: "text-3xl font-black tracking-tight",
        H4: "text-2xl font-black tracking-tight",
        P: "text-lg font-medium leading-relaxed",
        CAPTION: "text-xs font-bold uppercase tracking-wider",
    },
    GLASS: {
        CARD: "bg-white border border-slate-200 shadow-sm rounded-xl",
        TAG: "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all",
        TAG_ACTIVE: "bg-brand-blue text-white border border-brand-blue shadow-sm",
    }
} as const;
