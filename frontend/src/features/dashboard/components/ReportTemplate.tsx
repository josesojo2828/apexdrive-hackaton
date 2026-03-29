"use client";

import { Typography } from "@/components/atoms/Typography";
import { cn } from "@/utils/cn";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface TripData {
    id: string;
    createdAt: string;
    status: string;
    origin: string;
    destination: string;
    amount: string;
}

interface ReportTemplateProps {
    user: any;
    trips: TripData[];
    filters: { status: string; start?: string; end?: string };
}

export const ReportTemplate = ({ user, trips, filters }: ReportTemplateProps) => {
    return (
        <div id="report-content" className="p-8 bg-white w-full print:p-0 print:m-0">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-1">SPEEDDRIVE // REPORT</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">CARRERAS REALIZADAS - AUDITORÍA INTERNA</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-900">Fecha de Emisión</p>
                    <p className="text-xs font-bold text-slate-500">{new Date().toLocaleString()}</p>
                </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-4">Información del Usuario</p>
                    <div className="space-y-2">
                        <p className="text-lg font-black text-slate-900 uppercase">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs font-bold text-slate-500">{user?.email}</p>
                        <div className="inline-block px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest mt-2">
                            {user?.role}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-4">Criterios del Reporte</p>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Estado:</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase">{filters.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Rango:</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase">
                                {filters.start || 'INICIO'} - {filters.end || 'HOY'}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Registros:</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase">{trips.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse mb-12">
                <thead>
                    <tr className="border-y-2 border-slate-900">
                        <th className="py-4 text-[10px] font-black text-slate-900 uppercase text-left">ID</th>
                        <th className="py-4 text-[10px] font-black text-slate-900 uppercase text-left">Fecha</th>
                        <th className="py-4 text-[10px] font-black text-slate-900 uppercase text-center">Estado</th>
                        <th className="py-4 text-[10px] font-black text-slate-900 uppercase text-left">Origen - Destino</th>
                        <th className="py-4 text-[10px] font-black text-slate-900 uppercase text-right">Monto</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {trips.map((trip) => (
                        <tr key={trip.id} className="print:break-inside-avoid">
                            <td className="py-4 font-mono text-[10px] text-slate-400">#{trip.id.slice(-6).toUpperCase()}</td>
                            <td className="py-4 text-[10px] font-bold text-slate-500">{new Date(trip.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 text-center">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border",
                                    trip.status === 'DELIVERED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'
                                )}>
                                    {trip.status}
                                </span>
                            </td>
                            <td className="py-4">
                                <p className="text-[10px] font-black text-slate-700 uppercase">{trip.origin}</p>
                                <p className="text-[9px] text-slate-400 italic">Hacia: {trip.destination}</p>
                            </td>
                            <td className="py-4 text-right font-black text-slate-900 text-xs">${trip.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div className="mt-auto border-t border-slate-100 pt-12 flex justify-between items-center opacity-30 print:opacity-100">
                <p className="text-[9px] font-black uppercase tracking-widest leading-none">© 2026 SPEEDDRIVE - SISTEMA DE GESTIÓN DE FLOTA</p>
                <div className="text-[9px] font-black uppercase tracking-widest leading-none after:content-[counter(page)]">
                    REPORTE GENERADO EL {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};
