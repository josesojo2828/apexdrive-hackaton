"use client";

import { useCrud } from "@/features/dashboard/hooks/useCrud";
import CustomCrud from "@/features/dashboard/pages/CustomCrud";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ReportTemplate } from "@/features/dashboard/components/ReportTemplate";
import { useState } from "react";
import apiClient from "@/utils/api/api.client";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";

export default function SlugCrudPage() {
    const params = useParams();
    const slug = params.slug as string;
    const t = useTranslations();

    const {
        config, data, loading, save, remove, isMutating,
        orderBy, toggleSort, search, setSearch, pagination,
        extraFilters, setExtraFilters
    } = useCrud(slug);

    const [allDataForReport, setAllDataForReport] = useState<any[]>([]);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const handlePrintAll = async () => {
        if (slug !== 'trip') return;
        try {
            setIsGeneratingReport(true);
            const response = await apiClient.get('/trip', {
                params: {
                    take: 2000,
                    orderBy: JSON.stringify({ createdAt: 'desc' }),
                    ...extraFilters,
                    search: search
                }
            });
            const result = response.data?.body?.data || response.data?.body || response.data;
            setAllDataForReport(Array.isArray(result) ? result : result.data || []);

            // Esperar al siguiente tick para asegurar que el portal se renderice
            setTimeout(() => {
                window.print();
            }, 500);
        } catch (err) {
            console.error("Error fetching all data for report:", err);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const filterableColumns = config?.columns?.filter(c => c.type === 'badge' || c.type === 'boolean') || [];

    return (
        <div className="w-full space-y-8 animate-fade-in">
            <div className="px-6 md:px-0 flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('dashboard.search')}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black tracking-widest uppercase text-slate-800 outline-none focus:border-[#00f2fe]/50 focus:ring-4 focus:ring-[#00f2fe]/5 transition-all placeholder:text-slate-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {loading && data.length > 0 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-slate-200 border-t-[#00f2fe] rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {/* Filters mapped from badge/boolean columns */}
                {filterableColumns.map(col => {
                    const value = extraFilters[col.key] || 'ALL';

                    // Specific options for common status enums
                    const options = [{ value: 'ALL', label: t('dashboard.all') }];
                    if (col.type === 'boolean') {
                        options.push({ value: 'true', label: t('status.active') });
                        options.push({ value: 'false', label: t('status.inactive') });
                    } else if (col.key === 'status') {
                        // Trip/User Status defaults
                        const statuses = ['PENDING', 'ACCEPTED', 'DELIVERED', 'CANCELLED', 'ACTIVE', 'SUSPENDED', 'BANNED'];
                        statuses.forEach(s => options.push({ value: s, label: s }));
                    }

                    return (
                        <div key={col.key} className="relative group min-w-[140px]">
                            <select
                                value={value}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const newF = { ...extraFilters };
                                    if (val === 'ALL') delete newF[col.key];
                                    else newF[col.key] = val;
                                    setExtraFilters(newF);
                                }}
                                className="w-full h-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black tracking-widest uppercase text-slate-800 outline-none focus:border-[#00f2fe]/50 appearance-none cursor-pointer"
                            >
                                {options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4facfe]" />
                            </div>
                        </div>
                    );
                })}

                {/* Print Button only for trips */}
                {slug === 'trip' && (
                    <button
                        onClick={handlePrintAll}
                        disabled={isGeneratingReport || data.length === 0}
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:-translate-y-1 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-30 disabled:translate-y-0"
                    >
                        {isGeneratingReport ? (
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <DynamicIcon name="Printer" size={12} />
                        )}
                        {t('dashboard.print_report')}
                    </button>
                )}
            </div>

            {slug === 'trip' && allDataForReport.length > 0 && (
                <div className="hidden print:block">
                    <ReportTemplate
                        trips={allDataForReport}
                        user={null}
                        filters={{ status: extraFilters.status || 'ALL', start: '', end: '' }}
                    />
                </div>
            )}

            <CustomCrud
                remove={remove}
                slug={slug}
                config={config}
                data={data}
                loading={loading}
                save={save}
                isMutating={isMutating}
                orderBy={orderBy}
                toggleSort={toggleSort}
                pagination={pagination}
            />
        </div>
    );
}