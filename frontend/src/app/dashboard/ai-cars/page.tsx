"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Car, Palette, MapPin, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import apiClient from "@/utils/api/api.client";
import { cn } from "@/utils/cn";

export default function AiCarsPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        brand: "",
        model: "",
        color: "",
        type: "Deportivo"
    });

    const carTypes = ["Deportivo", "SUV", "Camioneta", "Sedán Luxe", "Hypercar", "Off-Road"];

    const handleGenerate = async () => {
        if (!form.brand || !form.model || !form.color) {
            setError("Por favor completa todos los campos.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await apiClient.post("/ai-imaging/generate-car", form);
            setResult(res.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Error al conectar con Nano Banana. Verifica tu API Key.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Sparkles size={20} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900">AI_CAR_LAB</h1>
                </div>
                <p className="text-slate-500 font-medium text-sm ml-13">Generación de flota de alta fidelidad con Nano Banana Engine</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                        <div className="space-y-6">
                            {/* Brand & Model */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Marca</label>
                                    <div className="relative">
                                        <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="Ej. Ferrari"
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                                            value={form.brand}
                                            onChange={(e) => setForm({...form, brand: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Modelo</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej. Purosangue"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                                        value={form.model}
                                        onChange={(e) => setForm({...form, model: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Color de Pintura</label>
                                <div className="relative">
                                    <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Ej. Rosso Corsa, Shark Blue..."
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                                        value={form.color}
                                        onChange={(e) => setForm({...form, color: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Type Selector */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipo de Vehículo</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {carTypes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setForm({...form, type: t})}
                                            className={cn(
                                                "py-3 rounded-xl text-[10px] font-bold uppercase tracking-tighter transition-all border",
                                                form.type === t 
                                                    ? "bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/20" 
                                                    : "bg-white border-black/5 text-slate-400 hover:border-slate-200"
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-shake">
                                <AlertCircle size={18} />
                                <span className="text-xs font-bold uppercase tracking-tighter">{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={cn(
                                "w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all",
                                loading 
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                    : "bg-[#1D1D1F] text-white hover:bg-orange-600 hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10"
                            )}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Configurando Nano Banana...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generar Render Studio
                                </>
                            )}
                        </button>
                    </div>

                    <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                        <p className="text-[10px] text-blue-600 font-bold uppercase leading-relaxed tracking-wider">
                           * La imagen se generará con fondo claro de estudio y sombras realistas de piso automáticamente.
                        </p>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-7">
                    <div className="bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200 h-[600px] flex items-center justify-center relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full h-full p-4 flex flex-col items-center justify-center gap-6"
                                >
                                    <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-white/20">
                                        <img src={result.url} alt="Generated Car" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="absolute top-8 right-8 flex gap-2">
                                        <div className="px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
                                            <CheckCircle2 size={12} /> Exito
                                        </div>
                                    </div>
                                </motion.div>
                            ) : loading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center space-y-4"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin mx-auto" />
                                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 animate-pulse" size={24} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Modelando texturas...</p>
                                </motion.div>
                            ) : (
                                <div className="text-center space-y-4 opacity-30">
                                    <Car size={64} className="mx-auto text-slate-300" />
                                    <p className="text-xs font-black uppercase tracking-widest">Esperando configuración...</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
