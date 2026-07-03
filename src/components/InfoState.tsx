import type { ReactNode } from "react";
import { Link } from "react-router-dom";


export const InfoItem = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
    <div className="border border-[#1f1f1f] bg-[#171717] p-4 animate-fade-in-up hover:border-[#4d4732] hover:scale-[1.02] transition-all duration-200">
        <div className="flex items-center gap-2 text-[#ffd700] mb-2">
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#777]">{label}</span>
        </div>
        <p className="text-sm font-medium text-[#e5e2e1]">{value}</p>
    </div>
);

export const LoadingState = () => (
    <div className="space-y-4 animate-fade-in">
        <div className="h-8 w-2/3 bg-[#1f1f1f] animate-pulse" />
        <div className="h-4 w-full bg-[#1f1f1f] animate-pulse" />
        <div className="h-4 w-5/6 bg-[#1f1f1f] animate-pulse" />
        <div className="h-32 w-full bg-[#1f1f1f] animate-pulse" />
    </div>
);

export const EmptyState = ({ title, message, to }: { title: string; message: string; to: string }) => (
    <div className="py-12 text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-[#999077] mb-6">{message}</p>
        <Link to={to} className="inline-flex border border-[#ffd700] px-5 py-2 text-sm font-bold uppercase tracking-[2px] text-[#ffd700] hover:bg-[#ffd700] hover:text-black hover:scale-105 active:scale-95 transition-all duration-200">
            Kembali
        </Link>
    </div>
);

export const ListSection = ({ title, icon, items, emptyText }: { title: string; icon: ReactNode; items: string[]; emptyText: string }) => (
    <section className="border border-[#1f1f1f] bg-[#171717] p-4 animate-fade-in-up">
        <div className="flex items-center gap-2 text-[#ffd700] mb-3">
            <span className="text-xl">{icon}</span>
            <h3 className="text-sm font-bold uppercase tracking-[2px]">{title}</h3>
        </div>
        {items.length > 0 ? (
            <ul className="space-y-2 text-sm text-[#d0c6ab]">
                {items.map((item, index) => (
                    <li
                        key={item}
                        className="flex gap-2 animate-fade-in-up"
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#ffd700]" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-[#777]">{emptyText}</p>
        )}
    </section>
);