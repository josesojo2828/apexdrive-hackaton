import { DynamicIcon } from "@/components/atoms/DynamicIcon";

interface DateRangeFilterProps {
    startDate: string;
    endDate: string;
    onChange: (start: string, end: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ startDate, endDate, onChange }) => {

    const presets = [
        { label: 'Today', days: 0 },
        { label: 'Yesterday', days: 1 },
        { label: 'Last 7 Days', days: 7 },
        { label: 'Last 30 Days', days: 30 },
    ];

    const applyPreset = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        if (days === 1) { // Yesterday
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            end.setDate(end.getDate());
        }
        onChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white/40  p-2 rounded-2xl border border-slate-200  backdrop-blur-xl">
            <div className="flex items-center gap-2 px-2 overflow-x-auto scrollbar-hide w-full md:w-auto">
                {presets.map((preset) => (
                    <button
                        key={preset.label}
                        onClick={() => applyPreset(preset.days)}
                        className="whitespace-nowrap px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-blue hover:bg-white  transition-all"
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div className="h-4 w-[1px] bg-slate-200  hidden md:block" />

            <div className="flex items-center gap-2 w-full md:w-auto px-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onChange(e.target.value, endDate)}
                    className="bg-transparent border-none text-[10px] font-bold text-brand-blue  focus:ring-0 cursor-pointer"
                />
                <DynamicIcon name="ArrowRight" size={12} className="opacity-30" />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onChange(startDate, e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-brand-blue  focus:ring-0 cursor-pointer"
                />
            </div>
        </div>
    );
};
