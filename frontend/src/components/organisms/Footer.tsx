"use client";

import Link from "next/link";
import { Github, Globe, Mail, MessageCircle } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="relative bg-white pt-28 pb-12 px-10 md:px-20 border-t border-black/5 overflow-hidden">
            <div className="max-w-[1500px] mx-auto space-y-20 relative z-10">
                
                {/* Minimalist Hackathon Footer */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-20">
                     <div className="space-y-4">
                          <h2 className="text-[9px] font-black uppercase tracking-[1em] text-black/30 italic serif">Proyecto de Desarrollo</h2>
                          <h1 className="text-6xl md:text-[8rem] font-black text-black tracking-tighter italic serif uppercase leading-[0.65]">
                               Apex<span className="text-black/5">Drive</span>
                          </h1>
                          <div className="max-w-md pt-10">
                               <p className="text-[10px] text-black/40 font-black uppercase tracking-[0.2em] leading-relaxed">
                                    AVISO: Esta plataforma es un prototipo técnico desarrollado exclusivamente para el **APEX DRIVE HACKATHON**. Los datos, vehículos y transacciones mostrados son simulaciones para fines de demostración de arquitectura frontend y backend.
                               </p>
                          </div>
                     </div>

                     {/* Contact Info Column */}
                     <div className="space-y-10">
                          <h2 className="text-[9px] font-black uppercase tracking-[0.8em] text-black/20 border-b border-black/5 pb-4">Desarrollador</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10">
                               <ContactItem 
                                    icon={<MessageCircle size={14}/>} 
                                    label="WhatsApp" 
                                    value="+58 412 8606734" 
                                    href="https://wa.me/584128606734"
                               />
                               <ContactItem 
                                    icon={<Mail size={14}/>} 
                                    label="Email" 
                                    value="josesojo2828@gmail.com" 
                                    href="mailto:josesojo2828@gmail.com"
                               />
                               <ContactItem 
                                    icon={<Github size={14}/>} 
                                    label="Github" 
                                    value="@josesojo2828" 
                                    href="https://github.com/josesojo2828"
                               />
                               <ContactItem 
                                    icon={<Globe size={14}/>} 
                                    label="Portafolio" 
                                    value="jsojo.quanticarch.com" 
                                    href="https://jsojo.quanticarch.com/"
                               />
                          </div>
                     </div>
                </div>

                <div className="pt-16 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
                     <span className="text-[8px] font-black text-black/10 uppercase tracking-[1em]">© 2026 Jose Sojo // Hackathon Edition</span>
                     <div className="flex gap-8">
                          <span className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em] italic">Built with Precision</span>
                          <span className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em] italic">Frontend & Backend Architecture</span>
                     </div>
                </div>
            </div>

            {/* Background Background Decor */}
            <div className="absolute right-[-10%] top-[30%] opacity-[0.01] pointer-events-none select-none">
                 <h2 className="text-[35rem] font-black italic serif uppercase text-black">APEX</h2>
            </div>
        </footer>
    );
};

function ContactItem({ icon, label, value, href }: { icon: any, label: string, value: string, href: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-2">
             <div className="flex items-center gap-3">
                  <div className="text-black/20 group-hover:text-primary transition-colors">{icon}</div>
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-black/30 group-hover:text-black transition-all">{label}</span>
             </div>
             <span className="text-xs font-black text-black tracking-tight italic uppercase">{value}</span>
        </a>
    );
}
