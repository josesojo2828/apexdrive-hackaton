"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObjectPage, TableColumn, ObjectActionsScreens } from "@/types/user/dashboard";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { FormGenerator } from "../components/FormGenerator";
import { ConfirmModal } from "../components/ConfirmModal";
import { FormStructure } from "@/types/form/generic.form";
import { cn } from "@/utils/cn";
import { ModuleColumns } from "@/types/table/app.table";
import { SortParam } from "../hooks/useCrud";
import { useTranslations } from "next-intl";
import { useLocalTranslation, TranslatableField } from "../hooks/useLocalTranslation";

// Imports de formularios
import * as UserForms from "@/types/form/user.form";
import * as SubscriptionForms from "@/types/form/subscription.form";
import * as RegionForms from "@/types/form/regions.form";
import * as AppForms from "@/types/form/app.form";
import { Typography } from "@/components/atoms/Typography";
import { AdvancedSkeleton, EmptyState } from "../components/AdvancedSkeleton";

export interface CrudRecord {
    id: string | number;
    [key: string]: string | number | boolean | null | undefined | unknown;
}

interface CustomCrudProps {
    slug: string;
    config: ObjectPage | null;
    data: CrudRecord[];
    loading: boolean;
    save: (formData: Record<string, unknown>, id?: string | number) => Promise<{ success: boolean; error?: Error }>;
    remove: (id: string | number) => Promise<{ success: boolean; error?: Error }>;
    isMutating: boolean;
    orderBy: SortParam[];
    toggleSort: (field: string) => void;
    pagination: {
        page: number;
        setPage: (p: number) => void;
        itemsPerPage: number;
        setItemsPerPage: (n: number) => void;
        totalItems: number;
    };
}



// ─── Cell renderer ───────────────────────────────────────────────
const DataCell = ({ value, column }: { value: unknown; column: TableColumn }) => {
    const t = useTranslations();
    const { tField } = useLocalTranslation();
    if (value === null || value === undefined || value === "")
        return <span className="opacity-30 text-[10px] italic">—</span>;

    switch (column.type) {
        case 'date':
            return <span className="text-xs opacity-50 tabular-nums font-medium">{new Date(value as string).toLocaleDateString()}</span>;
        case 'currency':
            return <span className="text-xs font-bold tabular-nums">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}</span>;
        case 'badge':
            const statusColors: Record<string, string> = {
                'PENDING': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                'ACCEPTED': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                'PICKED_UP': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                'IN_TRANSIT': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                'DELIVERED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                'CANCELLED': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            };
            const colorClass = statusColors[String(value).toUpperCase()] || 'badge-ghost';
            return <span className={cn("badge text-[9px] font-black uppercase tracking-tighter border", colorClass)}>{String(value)}</span>;
        case 'boolean':
            return value ? (
                <span className="badge badge-success text-[9px] font-black italic tracking-tighter uppercase">{t('status.active')}</span>
            ) : (
                <span className="badge badge-ghost text-[9px] font-black italic tracking-tighter uppercase opacity-50">{t('status.inactive')}</span>
            );
        default:
            const content = typeof value === 'object' && value !== null
                ? tField(value as TranslatableField)
                : String(value);
            return <span className="text-[12px] font-medium truncate max-w-[200px] block text-slate-700 ">{content}</span>;
    }
};

const MobileCard = ({ item, columns, onAction, onClick, actionsRows }: {
    item: CrudRecord;
    columns: TableColumn[];
    onAction: (act: ObjectActionsScreens, item: CrudRecord) => void;
    onClick: () => void;
    actionsRows: ObjectActionsScreens[];
}) => {
    const t = useTranslations();
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 active:scale-[0.98] transition-all" onClick={onClick}>
            <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest block opacity-70">ID: {String(item.id).substring(0, 8)}</span>
                    <Typography variant="P" className="text-slate-900 font-bold text-xs uppercase">
                        {String(item[columns[0]?.key] || 'Record')}
                    </Typography>
                </div>
                <DataCell value={item['status']} column={{ key: 'status', label: 'Status', type: 'badge' }} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                {columns.slice(1, 4).map(col => (
                    <div key={col.key} className="space-y-1">
                        <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">{t(col.label)}</span>
                        <div className="block"><DataCell value={item[col.key]} column={col} /></div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {actionsRows.map((act, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); onAction(act, item); }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500"
                    >
                        <DynamicIcon name={act.icon} className="w-3.5 h-3.5" />
                    </button>
                ))}
            </div>
        </div>
    );
};

// ─── Main component ──────────────────────────────────────────────
export default function CustomCrud({
    slug, config, data, loading, save, remove, isMutating, orderBy, toggleSort, pagination
}: CustomCrudProps) {
    const router = useRouter();
    const t = useTranslations();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [activeRecord, setActiveRecord] = useState<CrudRecord | undefined>(undefined);

    const activeColumns: TableColumn[] = config?.columns || ModuleColumns[slug] || [];

    const getFormStructure = (currentSlug: string): FormStructure | null => {
        const localForms: Record<string, FormStructure> = {
            'user': UserForms.UserCreateForm,
            'address': UserForms.AddressCreateForm,
            'notification': UserForms.NotificationCreateForm,
            'region': RegionForms.RegionForm,
            'country': RegionForms.CountryForm,
            'state': RegionForms.StateForm,
            'city': RegionForms.CityForm,
            'currency': RegionForms.CurrencyForm,
            'subscription': SubscriptionForms.SubscriptionCreateForm,
            'subscription-plan': SubscriptionForms.SubscriptionPlanCreateForm,
            'resource': AppForms.ResourceForm,
            'category-items': AppForms.CategoryByItemsForm,
            'question': AppForms.QuestionForm,
            'messages-web': AppForms.MessagesInToWebForm,
            'testimonial': AppForms.TestimonialsForm,
            'about': AppForms.ApplicationAboutForm,
            'objective': AppForms.ApplicationObjetivesForm,
            'social-media': AppForms.ApplicationSocialMediaForm,
            'value': AppForms.ApplicationValuesForm,
        };
        // Siempre priorizar las estructuras locales si existen, porque contienen tipos avanzados (translatable, remote).
        if (localForms[currentSlug]) return localForms[currentSlug];

        // Si no existe localmente, entonces caemos al que trajo el config de la BD
        return config?.form || null;
    };

    const handleAction = (act: ObjectActionsScreens, item: CrudRecord) => {
        if (act.type === 'page') {
            const query = act.action === 'session' ? `?userId=${item.id}` : '';
            router.push(`/dashboard/${act.action}${query}`);
            return;
        }

        setActiveRecord(item);
        const isDeleteAction =
            act.icon?.toLowerCase().includes('trash') ||
            act.label?.toLowerCase().includes('borrar') ||
            act.label?.toLowerCase().includes('delete');
        if (isDeleteAction) setShowConfirm(true);
        else setShowModal(true);
    };

    const getResponsiveClass = (res?: string): string => {
        if (res === 'md') return "hidden md:table-cell";
        if (res === 'lg') return "hidden lg:table-cell";
        return "table-cell";
    };

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* ── Header ────────────────────────────────────────── */}
            <header className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
                <div className="space-y-1">
                    <Typography variant="H3" className="text-base-content !tracking-tighter !leading-none font-black">
                        {config?.title ? t(config.title) : slug}
                    </Typography>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">
                            {config?.subtitle ? t(config.subtitle) : `DATABASE_MANAGEMENT // ${slug}_PROTOCOL`}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    {config?.actions.map((act: ObjectActionsScreens, i: number) => {
                        // Validación Singleton: Si es el módulo 'about' y hay registro, no mostrar botón de crear
                        if (slug === 'about' && act.action === 'add' && data.length >= 1) return null;

                        return (
                            <button
                                key={i}
                                onClick={() => { setActiveRecord(undefined); setShowModal(true); }}
                                className="
                                    flex-1 sm:flex-none flex items-center gap-3 px-6 py-3 rounded-2xl 
                                    bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-slate-900 
                                    text-[11px] font-black uppercase tracking-wider 
                                    hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(0,242,254,0.3)] 
                                    active:scale-[0.98] transition-all duration-300
                                "
                            >
                                <DynamicIcon name={act.icon} className="w-4 h-4" />
                                {t(act.label)}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* ── Table Container ────────────────────────────────── */}
            <main className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative group">
                {isMutating && (
                    <div className="absolute inset-0 bg-base-100/60  z-20 flex items-center justify-center animate-in fade-in backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-white/10 border-t-[#00f2fe] rounded-full animate-spin" />
                            <span className="text-[8px] font-black text-[#00f2fe] uppercase tracking-widest">{t('action.processing')}</span>
                        </div>
                    </div>
                )}

                <div className="hidden md:block overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-base-200/50 ">
                            <tr>
                                {activeColumns.map((col) => {
                                    const sort = orderBy.find(s => s.field === col.key);
                                    return (
                                        <th
                                            key={col.key}
                                            onClick={() => toggleSort(col.key)}
                                            className={cn(
                                                "px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-all select-none group/th bg-slate-50/80",
                                                getResponsiveClass(col.responsive)
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="group-hover/th:text-base-content transition-colors">{t(col.label)}</span>
                                                {sort && (
                                                    <div className="w-3.5 h-3.5 rounded bg-[#00f2fe]/10 flex items-center justify-center">
                                                        <DynamicIcon name={sort.order === 'asc' ? 'ChevronUp' : 'ChevronDown'} className="w-2.5 h-2.5 text-[#00f2fe]" />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                                <th className="px-4 py-3 md:px-6 md:py-3 text-[11px] font-bold text-slate-400  uppercase tracking-wider border-b border-base-200  text-right bg-slate-50/50 ">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-200 ">
                            {loading && data.length === 0 ? (
                                <tr>
                                    <td colSpan={activeColumns.length + 1} className="py-10">
                                        <AdvancedSkeleton type="table" rows={6} />
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={activeColumns.length + 1} className="py-16 md:py-24">
                                        <EmptyState />
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="group/tr hover:bg-base-200/50  transition-all cursor-pointer"
                                    >
                                        {activeColumns.map((col) => (
                                            <td
                                                key={col.key}
                                                onClick={() => router.push(`/dashboard/${slug}/${item.id}`)}
                                                className={cn("px-4 py-2 align-middle border-b border-slate-100", getResponsiveClass(col.responsive))}
                                            >
                                                <DataCell value={item[col.key]} column={col} />
                                            </td>
                                        ))}
                                        <td className="px-4 py-2 text-right align-middle border-b border-slate-100">
                                            <div className="flex justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover/tr:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/${slug}/${item.id}`); }}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-base-200  border border-base-300  text-slate-500  hover:text-base-content  transition-all"
                                                >
                                                    <DynamicIcon name="Eye" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                                {config?.actionsRows.map((act, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => { e.stopPropagation(); handleAction(act, item); }}
                                                        className={cn(
                                                            "w-7 h-7 flex items-center justify-center rounded-lg bg-base-200  border border-base-300  text-slate-500  hover:text-base-content  transition-all",
                                                            act.icon?.toLowerCase().includes('trash')
                                                                ? "hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30"
                                                                : "hover:bg-base-300 "
                                                        )}
                                                        title={t(act.label)}
                                                    >
                                                        <DynamicIcon name={act.icon} className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4 space-y-4">
                    {loading && data.length === 0 ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-40 bg-white/5 animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    ) : data.length === 0 ? (
                        <div className="py-20 text-center opacity-20">
                            <DynamicIcon name="Search" className="w-10 h-10 mx-auto mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t('error.not_found')}</span>
                        </div>
                    ) : (
                        data.map((item) => (
                            <MobileCard
                                key={item.id}
                                item={item}
                                columns={activeColumns}
                                actionsRows={config?.actionsRows || []}
                                onAction={handleAction}
                                onClick={() => router.push(`/dashboard/${slug}/${item.id}`)}
                            />
                        ))
                    )}
                </div>

                {/* ── Pagination Footer ──────────────────────────── */}
                <footer className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            {t('dashboard.showing')} {Math.min((pagination.page - 1) * pagination.itemsPerPage + 1, pagination.totalItems)} - {Math.min(pagination.page * pagination.itemsPerPage, pagination.totalItems)} {t('dashboard.of')} {pagination.totalItems}
                        </span>
                        
                        <select 
                            value={pagination.itemsPerPage}
                            onChange={(e) => pagination.setItemsPerPage(Number(e.target.value))}
                            className="bg-transparent border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-black uppercase outline-none focus:border-[#00f2fe]"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            disabled={pagination.page === 1 || loading}
                            onClick={() => pagination.setPage(pagination.page - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-brand-blue disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <DynamicIcon name="ChevronLeft" className="w-4 h-4" />
                        </button>
                        
                        <div className="flex gap-1">
                            {[...Array(Math.min(5, Math.ceil(pagination.totalItems / pagination.itemsPerPage)))].map((_, i) => {
                                // Simple sliding window for pagination pages
                                const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);
                                let pageNum = i + 1;
                                if (pagination.page > 3 && totalPages > 5) {
                                    pageNum = pagination.page - 3 + i + 1;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => pagination.setPage(pageNum)}
                                        className={cn(
                                            "w-8 h-8 rounded-xl text-[10px] font-black transition-all",
                                            pagination.page === pageNum 
                                                ? "bg-slate-900 text-[#00f2fe]" 
                                                : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                                        )}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button 
                            disabled={pagination.page >= Math.ceil(pagination.totalItems / pagination.itemsPerPage) || loading}
                            onClick={() => pagination.setPage(pagination.page + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-brand-blue disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <DynamicIcon name="ChevronRight" className="w-4 h-4" />
                        </button>
                    </div>
                </footer>
            </main>

            {/* ── Modal de formulario con DaisyUI ───────────────── */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box w-full max-w-2xl rounded-[2rem] p-0 overflow-visible flex flex-col max-h-[94vh]">
                        <header className="px-10 py-6 border-b border-base-200 flex justify-between items-center bg-base-200/40">
                            <h3 className="text-sm font-black uppercase tracking-tighter italic leading-none">
                                {activeRecord ? t('action.modify_record') : t('action.create_entry')} / {slug}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                <DynamicIcon name="X" className="w-4 h-4" />
                            </button>
                        </header>
                        <div className="p-10 overflow-visible flex-1">
                            {getFormStructure(slug) && (
                                <FormGenerator
                                    structure={getFormStructure(slug)!}
                                    defaultValues={activeRecord as Record<string, unknown>}
                                    isUpdate={!!activeRecord?.id}
                                    onSubmit={async (val) => { const r = await save(val, activeRecord?.id); if (r.success) setShowModal(false); }}
                                    onCancel={() => setShowModal(false)}
                                />
                            )}
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowModal(false)} />
                </div>
            )}

            <ConfirmModal
                isOpen={showConfirm}
                title={t('action.terminate_record')}
                message={t('dialog.delete_confirm', { slug })}
                isLoading={isMutating}
                onConfirm={async () => { if (activeRecord?.id) { const r = await remove(activeRecord.id); if (r.success) setShowConfirm(false); } }}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}
