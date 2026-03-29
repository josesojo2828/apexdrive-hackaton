"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import { User, Phone, Mail, Save, Edit2, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/utils/api/api.client";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Personal info state
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [saving, setSaving] = useState(false);

    // Password info state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updatingPwd, setUpdatingPwd] = useState(false);

    const refreshUser = async () => {
        try {
            const res = await apiClient.get('/auth/check');
            updateUser(res.data);
        } catch {}
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiClient.put(`/user/${user?.id}`, { firstName, lastName, phone });
            toast.success('Perfil actualizado');
            await refreshUser();
            setIsEditing(false);
        } catch {
            toast.error('Error al actualizar');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setUpdatingPwd(true);
        try {
            await apiClient.post('/auth/change-password', { oldPassword, newPassword });
            toast.success('Contraseña actualizada correctamente');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsUpdatingPassword(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al actualizar contraseña');
        } finally {
            setUpdatingPwd(false);
        }
    };

    const cancel = () => {
        setFirstName(user?.firstName || '');
        setLastName(user?.lastName || '');
        setPhone(user?.phone || '');
        setIsEditing(false);
    };

    const cancelPwd = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsUpdatingPassword(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                    {user?.firstName?.charAt(0)}
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">{user?.firstName} {user?.lastName}</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role} · {user?.email}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-black text-slate-900">Información personal</h2>
                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Datos básicos de tu cuenta</p>
                            </div>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
                                    <Edit2 size={12} /> Editar
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={cancel}
                                        className="px-3 py-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all">
                                        Cancelar
                                    </button>
                                    <button onClick={handleSave} disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-blue-600 transition-all disabled:opacity-50">
                                        <Save size={12} /> {saving ? '...' : 'Guardar'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Nombre" icon={<User size={14} />}>
                                {isEditing ? (
                                    <input value={firstName} onChange={e => setFirstName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                ) : (
                                    <p className="text-sm font-black text-slate-900 py-3">{user?.firstName || '—'}</p>
                                )}
                            </Field>

                            <Field label="Apellido" icon={<User size={14} />}>
                                {isEditing ? (
                                    <input value={lastName} onChange={e => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                ) : (
                                    <p className="text-sm font-black text-slate-900 py-3">{user?.lastName || '—'}</p>
                                )}
                            </Field>

                            <Field label="Correo electrónico" icon={<Mail size={14} />}>
                                <p className="text-sm font-bold text-slate-500 py-3">{user?.email}</p>
                                {isEditing && <p className="text-[9px] text-slate-300 font-bold -mt-2">El correo no se puede cambiar</p>}
                            </Field>

                            <Field label="Teléfono" icon={<Phone size={14} />}>
                                {isEditing ? (
                                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+58 412 1234567"
                                        className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                ) : (
                                    <p className={cn("text-sm py-3", user?.phone ? "font-black text-slate-900" : "font-bold text-slate-300 italic")}>
                                        {user?.phone || 'Sin teléfono'}
                                    </p>
                                )}
                            </Field>
                        </div>
                    </div>
                </motion.div>

                {/* Password / Security */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-fit">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-black text-slate-900">Seguridad</h2>
                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Protección de acceso</p>
                            </div>
                            {!isUpdatingPassword ? (
                                <button onClick={() => setIsUpdatingPassword(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
                                    <Lock size={12} /> Cambiar contraseña
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={cancelPwd}
                                        className="px-3 py-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all">
                                        Cancelar
                                    </button>
                                    <button onClick={handleUpdatePassword} disabled={updatingPwd}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-blue-600 transition-all disabled:opacity-50">
                                        <ShieldCheck size={12} /> {updatingPwd ? '...' : 'Actualizar'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {isUpdatingPassword ? (
                            <div className="space-y-4">
                                <Field label="Contraseña actual" icon={<Lock size={14} />}>
                                    <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                </Field>
                                <Field label="Nueva contraseña" icon={<Lock size={14} />}>
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                </Field>
                                <Field label="Confirmar nueva contraseña" icon={<Lock size={14} />}>
                                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-50 border border-black/5 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                </Field>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-black/5">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-black/5">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Contraseña establecida</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter italic">Última actualización: Desconocida</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function Field({ label, icon, children }: { label: string; icon: any; children: any }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-1.5">
                <span className="text-slate-300">{icon}</span>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
            </div>
            {children}
        </div>
    );
}
