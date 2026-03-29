"use client";

import React from "react";
import Image from "next/image";
import { Copy, Hexagon, Type, Palette, Layout, Ghost, Check } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";
import { GlassCard } from "@/components/molecules/GlassCard";
import { IconBubble } from "@/components/atoms/IconBubble";

const ColorSwatch = ({ name, hex, description }: { name: string; hex: string; description: string }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative">
            <div
                className="w-full h-32 rounded-3xl mb-4 border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] flex items-end p-4"
                style={{ backgroundColor: hex }}
            >
                <div className="bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                    {hex}
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <Typography variant="H4" className="text-slate-900 dark:text-white mb-1">{name}</Typography>
                    <Typography variant="CAPTION" className="text-slate-500">{name.toLowerCase().replace(' ', '-')}</Typography>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 transition-colors"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>
            </div>
            <Typography variant="P" className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                {description}
            </Typography>
        </div>
    );
};

const IconShowcaseCard = ({ name, src }: { name: string; src: string }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        const filename = src.split('/').pop() || '';
        navigator.clipboard.writeText(filename);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="flex flex-col items-center group relative">
            <GlassCard
                onClick={handleCopy}
                className="w-full flex items-center justify-center p-4 mb-3 group-hover:border-[#00f2fe]/40 transition-all duration-500 cursor-pointer overflow-visible"
            >
                {/* Internal Pedestal Effect */}
                <div className="absolute inset-2 rounded-[1.5rem] border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 pointer-events-none" />

                {/* Icon Image */}
                <div className="relative w-12 h-12 z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Image
                        src={src}
                        alt={name}
                        width={48}
                        height={48}
                        className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_15px_rgba(0,242,254,0.1)]"
                        unoptimized
                    />
                </div>

                {/* Micro-glow */}
                <div className="absolute -inset-4 bg-[#00f2fe]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

                {/* Copied Indicator */}
                <div className={`absolute top-2 right-2 p-1.5 rounded-lg bg-[#00f2fe] text-white transition-all duration-300 ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <Check className="w-3 h-3" />
                </div>
            </GlassCard>
            <Typography variant="CAPTION" className="text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-[9px] truncate w-full text-center">
                {name}
            </Typography>
        </div>
    );
};

export default function IdentityPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-32 pb-24 px-4 overflow-hidden relative">
            {/* Mesh Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#4facfe 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#00f2fe]/10 dark:bg-[#00f2fe]/5 rounded-full blur-[120px] animate-blob" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-32">
                    <Typography variant="CAPTION" className="text-[#00f2fe] mb-4">Brand Identity System v1.1</Typography>
                    <Typography variant="DISPLAY" className="mb-6">Speed Delivery</Typography>
                    <Typography variant="P" className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        La identidad visual de Speed Delivery es una mezcla de precisión técnica, modernidad y la calidez de la comunidad latina en Japón.
                    </Typography>
                </div>

                {/* Typography Section */}
                <section className="mb-40">
                    <div className="flex items-center gap-4 mb-16 px-6">
                        <IconBubble colorClass="from-blue-400 to-blue-600">
                            <Type className="w-6 h-6" />
                        </IconBubble>
                        <Typography variant="H2">Typography</Typography>
                    </div>

                    <div className="space-y-16">
                        <div className="p-12 bg-white/40 dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/10 hover:border-[#00f2fe]/20 transition-all group backdrop-blur-sm">
                            <Typography variant="CAPTION" className="text-slate-500 mb-8 block font-black">Display Variant (Hero Focus)</Typography>
                            <Typography variant="DISPLAY" className="group-hover:text-[#00f2fe] transition-colors leading-none">
                                Premium Experience
                            </Typography>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { variant: 'H1' as const, label: 'Heading 1', text: 'Connecting Communities' },
                                { variant: 'H2' as const, label: 'Heading 2', text: 'Professional Directory' },
                                { variant: 'H3' as const, label: 'Heading 3', text: 'Platform Features' },
                                { variant: 'H4' as const, label: 'Heading 4', text: 'Category Title' },
                            ].map((item, i) => (
                                <div key={i} className="p-8 bg-white/40 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
                                    <Typography variant="CAPTION" className="text-slate-500 mb-6 block font-black uppercase">{item.label}</Typography>
                                    <Typography variant={item.variant} className="text-slate-900 dark:text-white">{item.text}</Typography>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-white/40 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
                            <Typography variant="CAPTION" className="text-slate-500 mb-6 block font-black">Paragraph (Body Text)</Typography>
                            <Typography variant="P" className="text-slate-600 dark:text-slate-300 max-w-4xl">
                                Speed Delivery utiliza la tipografía Plus Jakarta Sans por su legibilidad excepcional y su carácter moderno.
                                Diseñada para la era digital, ofrece una claridad perfecta tanto en pantallas de alta resolución como en interfaces móviles.
                            </Typography>
                        </div>
                    </div>
                </section>

                {/* Color Palette */}
                <section className="mb-40">
                    <div className="flex items-center gap-4 mb-16 px-6">
                        <IconBubble colorClass="from-purple-400 to-purple-600">
                            <Palette className="w-6 h-6" />
                        </IconBubble>
                        <Typography variant="H2">Color Palette</Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                        <ColorSwatch
                            name="Neon Blue"
                            hex="#00f2fe"
                            description="Color primario de acción y acento. Usado para CTAs, estados activos y micro-interacciones de alta prioridad."
                        />
                        <ColorSwatch
                            name="Deep Sky"
                            hex="#4facfe"
                            description="Tono de soporte para gradientes y elementos secundarios. Aporta profundidad al sistema visual."
                        />
                        <ColorSwatch
                            name="Dark Slate"
                            hex="#0f172a"
                            description="Color base del sistema. Utilizado para fondos principales y superficies de bajo nivel."
                        />
                        <ColorSwatch
                            name="Speed Alert"
                            hex="#ef4444"
                            description="Color funcional para errores, alertas críticas y etiquetas de alta visibilidad."
                        />
                    </div>
                </section>

                {/* Icon System */}
                <section className="mb-40 px-6">
                    <div className="flex items-center gap-4 mb-16">
                        <IconBubble colorClass="from-cyan-400 to-blue-600">
                            <Hexagon className="w-6 h-6" />
                        </IconBubble>
                        <Typography variant="H2">Premium Icon System</Typography>
                    </div>

                    <div className="space-y-32">
                        {/* User Management Category */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">User Management</Typography>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-6 max-w-5xl mx-auto">
                                {[
                                    { name: 'Profile', src: '/icons/svg/user-profile.svg' },
                                    { name: 'Security', src: '/icons/svg/user-security.svg' },
                                    { name: 'Settings', src: '/icons/svg/user-settings.svg' },
                                    { name: 'Admin', src: '/icons/svg/user-role-admin.svg' },
                                    { name: 'Login', src: '/icons/svg/user-auth-login.svg' },
                                    { name: 'Logout', src: '/icons/svg/user-auth-logout.svg' },
                                    { name: 'History', src: '/icons/svg/user-session-history.svg' },
                                    { name: 'Address', src: '/icons/svg/user-address.svg' },
                                    { name: 'Session', src: '/icons/svg/user-session.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Messaging Category */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Messaging & Logic</Typography>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 max-w-3xl mx-auto">
                                {[
                                    { name: 'Inbox', src: '/icons/svg/msg-inbox.svg' },
                                    { name: 'Chat', src: '/icons/svg/msg-chat-bubble.svg' },
                                    { name: 'Broadcast', src: '/icons/svg/msg-broadcast.svg' },
                                    { name: 'Bell', src: '/icons/svg/msg-notification-bell.svg' },
                                    { name: 'Urgent', src: '/icons/svg/msg-urgent.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Finance & Subscriptions */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Finance & Subscriptions</Typography>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 max-w-4xl mx-auto">
                                {[
                                    { name: 'Subscription', src: '/icons/svg/fin-subscription.svg' },
                                    { name: 'User Sub', src: '/icons/svg/fin-user-sub.svg' },
                                    { name: 'Wallet', src: '/icons/svg/fin-wallet.svg' },
                                    { name: 'Transaction', src: '/icons/svg/fin-transaction.svg' },
                                    { name: 'Crypto Wallet', src: '/icons/svg/fin-crypto-wallet.svg' },
                                    { name: 'Crypto Pay', src: '/icons/svg/fin-crypto-payment.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Products Category */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Products & Market</Typography>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 max-w-4xl mx-auto">
                                {[
                                    { name: 'Inventory', src: '/icons/svg/prod-inventory.svg' },
                                    { name: 'Tag', src: '/icons/svg/prod-tag.svg' },
                                    { name: 'Analytics', src: '/icons/svg/prod-analytics.svg' },
                                    { name: 'Quality', src: '/icons/svg/prod-quality-seal.svg' },
                                    { name: 'Discount', src: '/icons/svg/prod-discount.svg' },
                                    { name: 'Quick View', src: '/icons/svg/prod-quick-view.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Professional Categories */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Professional Slots</Typography>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 max-w-4xl mx-auto">
                                {[
                                    { name: 'Gastronomy', src: '/icons/svg/cat-gastronomy.svg' },
                                    { name: 'Business', src: '/icons/svg/cat-professional.svg' },
                                    { name: 'Wellness', src: '/icons/svg/cat-health-wellness.svg' },
                                    { name: 'Tech', src: '/icons/svg/cat-tech-repair.svg' },
                                    { name: 'Entertainment', src: '/icons/svg/cat-entertainment.svg' },
                                    { name: 'Transport', src: '/icons/svg/cat-transport.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Geography & Localization */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Geography & Localization</Typography>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 max-w-3xl mx-auto">
                                {[
                                    { name: 'Region', src: '/icons/svg/geo-region.svg' },
                                    { name: 'Country', src: '/icons/svg/geo-country.svg' },
                                    { name: 'State', src: '/icons/svg/geo-state.svg' },
                                    { name: 'City', src: '/icons/svg/geo-city.svg' },
                                    { name: 'Currency', src: '/icons/svg/geo-currency.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Logic & Meta */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">System & Operations</Typography>
                            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-6 max-w-6xl mx-auto">
                                {[
                                    { name: 'Booking', src: '/icons/svg/srv-calendar-booking.svg' },
                                    { name: 'Location', src: '/icons/svg/srv-location-pin.svg' },
                                    { name: 'Verified', src: '/icons/svg/srv-verification-check.svg' },
                                    { name: 'Payments', src: '/icons/svg/srv-payment-safe.svg' },
                                    { name: 'Review', src: '/icons/svg/srv-review-star.svg' },
                                    { name: 'Legal', src: '/icons/svg/srv-contract-legal.svg' },
                                    { name: 'Host', src: '/icons/svg/sys-host.svg' },
                                    { name: 'Upload', src: '/icons/svg/sys-upload.svg' },
                                    { name: 'Loader', src: '/icons/svg/sys-loader.svg' },
                                    { name: 'Load Balancer', src: '/icons/svg/sys-load-balancer.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* UI Actions & Navigation */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">UI Actions & Navigation</Typography>
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-6 max-w-5xl mx-auto">
                                {[
                                    { name: 'Create', src: '/icons/svg/ui-create.svg' },
                                    { name: 'Upload', src: '/icons/svg/ui-upload.svg' },
                                    { name: 'Delete', src: '/icons/svg/ui-delete.svg' },
                                    { name: 'Find', src: '/icons/svg/ui-find.svg' },
                                    { name: 'Search', src: '/icons/svg/ui-search.svg' },
                                    { name: 'Pagination', src: '/icons/svg/ui-pagination.svg' },
                                    { name: 'Arrow Left', src: '/icons/svg/nav-arrow-left.svg' },
                                    { name: 'Arrow Right', src: '/icons/svg/nav-arrow-right.svg' },
                                    { name: 'Arrow Up', src: '/icons/svg/nav-arrow-top.svg' },
                                    { name: 'Arrow Down', src: '/icons/svg/nav-arrow-down.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Social Media</Typography>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 max-w-4xl mx-auto">
                                {[
                                    { name: 'Instagram', src: '/icons/svg/soc-instagram.svg' },
                                    { name: 'TikTok', src: '/icons/svg/soc-tiktok.svg' },
                                    { name: 'Facebook', src: '/icons/svg/soc-facebook.svg' },
                                    { name: 'WhatsApp', src: '/icons/svg/soc-whatsapp.svg' },
                                    { name: 'Telegram', src: '/icons/svg/soc-telegram.svg' },
                                    { name: 'LinkedIn', src: '/icons/svg/soc-linkedin.svg' },
                                    { name: 'X', src: '/icons/svg/soc-twitter-x.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Japan Heritage & Nature */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Japan Heritage & Nature</Typography>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 max-w-5xl mx-auto">
                                {[
                                    { name: 'Torii', src: '/icons/svg/jp/jp-torii.svg' },
                                    { name: 'Fuji', src: '/icons/svg/jp/jp-fuji.svg' },
                                    { name: 'Sakura', src: '/icons/svg/jp/jp-sakura.svg' },
                                    { name: 'Architecture', src: '/icons/svg/jp/ancient-architecture-japan-svgrepo-com.svg' },
                                    { name: 'Shrine', src: '/icons/svg/jp/shinto-shrine-svgrepo-com.svg' },
                                    { name: 'Monument', src: '/icons/svg/jp/japan-monument-svgrepo-com.svg' },
                                    { name: 'Map', src: '/icons/svg/jp/map-of-japan-svgrepo-com.svg' },
                                    { name: 'Garden', src: '/icons/svg/jp/beautiful-garden-japan-svgrepo-com.svg' },
                                    { name: 'Tanabata', src: '/icons/svg/jp/tanabata-tree-svgrepo-com.svg' },
                                    { name: 'Monkey', src: '/icons/svg/jp/monkey-japan-japanese-svgrepo-com.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Japan Culture & Art */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Culture & Art</Typography>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 max-w-5xl mx-auto">
                                {[
                                    { name: 'Origami', src: '/icons/svg/jp/jp-origami.svg' },
                                    { name: 'Katana', src: '/icons/svg/jp/jp-katana.svg' },
                                    { name: 'Kabuto', src: '/icons/svg/jp/date-masamune-helmet-svgrepo-com.svg' },
                                    { name: 'Kendo', src: '/icons/svg/jp/fighter-japan-kendo-svgrepo-com.svg' },
                                    { name: 'Maneki Neko', src: '/icons/svg/jp/maneki-neko-japan-svgrepo-com.svg' },
                                    { name: 'Koinobori', src: '/icons/svg/jp/carp-fish-japan-svgrepo-com.svg' },
                                    { name: 'Wagasa', src: '/icons/svg/jp/wagasa-svgrepo-com.svg' },
                                    { name: 'Tanuki', src: '/icons/svg/jp/tanuki-svgrepo-com.svg' },
                                    { name: 'Shinkansen', src: '/icons/svg/jp/fast-japan-speed-svgrepo-com.svg' },
                                    { name: 'Post Office', src: '/icons/svg/jp/japanese-post-office-svgrepo-com.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>

                        {/* Japanese Cuisine */}
                        <div>
                            <Typography variant="H4" className="text-slate-400 dark:text-slate-500 mb-10 uppercase tracking-[0.2em] font-black text-center">Japanese Cuisine</Typography>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 max-w-5xl mx-auto">
                                {[
                                    { name: 'Ramen', src: '/icons/svg/jp/jp-ramen.svg' },
                                    { name: 'Sushi', src: '/icons/svg/jp/sushi-japanese-food-japanese-japan-japanese-cuisine-svgrepo-com.svg' },
                                    { name: 'Onigiri', src: '/icons/svg/jp/onigiri-rice-japanese-japan-japanese-food-japanese-cuisine-svgrepo-com.svg' },
                                    { name: 'Dango', src: '/icons/svg/jp/dango-japan-sweet-japanese-food-japanese-cuisine-svgrepo-com.svg' },
                                    { name: 'Curry', src: '/icons/svg/jp/curry-food-japan-svgrepo-com.svg' },
                                    { name: 'Chopsticks', src: '/icons/svg/jp/chopsticks-food-japan-svgrepo-com.svg' },
                                    { name: 'Naruto', src: '/icons/svg/jp/naruto-japanese-cuisine-japan-ramen-japanese-food-food-svgrepo-com.svg' },
                                ].map((icon) => <IconShowcaseCard key={icon.name} {...icon} />)}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Visual Assets */}
                <section className="mb-24 px-6">
                    <div className="flex items-center gap-4 mb-16">
                        <IconBubble colorClass="from-orange-400 to-orange-600">
                            <Layout className="w-6 h-6" />
                        </IconBubble>
                        <Typography variant="H2">Glass Interface System</Typography>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <GlassCard className="p-12 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 mb-8 flex items-center justify-center">
                                <Ghost className="w-10 h-10 text-[#00f2fe]" />
                            </div>
                            <Typography variant="H4" className="mb-4">Frosted Glass</Typography>
                            <Typography variant="P" className="text-sm text-slate-600 dark:text-slate-400">
                                Superficies translúcidas con desenfoque de fondo dinámico y bordes de cristal definidos.
                            </Typography>
                        </GlassCard>

                        <GlassCard className="p-12 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00f2fe]/20 to-transparent border border-[#00f2fe]/30 mb-8 flex items-center justify-center">
                                <Hexagon className="w-10 h-10 text-[#00f2fe]" />
                            </div>
                            <Typography variant="H4" className="mb-4">Ambient Glow</Typography>
                            <Typography variant="P" className="text-sm text-slate-600 dark:text-slate-400">
                                Iluminación ambiental que rodea los elementos interactivos para crear jerarquía visual.
                            </Typography>
                        </GlassCard>

                        <GlassCard className="p-12 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-8 flex items-center justify-center">
                                <Layout className="w-10 h-10 text-[#00f2fe]" />
                            </div>
                            <Typography variant="H4" className="mb-4">Layered Depth</Typography>
                            <Typography variant="P" className="text-sm text-slate-600 dark:text-slate-400">
                                Uso de sombras suaves y gradientes internos para simular profundidad en el eje Z.
                            </Typography>
                        </GlassCard>
                    </div>
                </section>
            </div>
        </main>
    );
}
