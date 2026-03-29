"use client";

import esMessages from '../locales/es.json';
import enMessages from '../locales/en.json';
import { useAuthStore } from '../store/useAuthStore';

const messages: Record<string, any> = {
    es: esMessages,
    en: enMessages
};

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((prev: any, curr: string) => (prev ? (prev as any)[curr] : undefined), obj);
}

export const useTranslations = (namespace?: string) => {
    const auth = useAuthStore() as { language?: string };
    const language = auth.language || 'es';
    const currentMessages = messages[language] || messages.es;

    const translate = (key: string, options?: Record<string, unknown>): string => {
        const fullKey = namespace ? `${namespace}.${key}` : key;
        const msg = resolvePath(currentMessages, fullKey);

        if (typeof msg !== 'string') return fullKey;
        if (!options) return msg;

        return msg.replace(/\{(\w+)\}/g, (_, k) => String(options[k] ?? `{${k}}`));
    };

    const t = Object.assign(
        (key: string, options?: Record<string, unknown>) => translate(key, options),
        { rich: (key: string, options?: Record<string, unknown>) => translate(key, options) }
    );

    return t;
};

export const useLocale = () => {
    const state = useAuthStore.getState() as { language?: string };
    return state.language || 'es';
};

export const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export const getMessages = async (locale: string) => messages[locale] || messages.es;
