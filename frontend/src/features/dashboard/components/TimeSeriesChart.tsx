"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TimeSeriesData {
    date: string;
    trips: number;
    revenue: number;
}

export const TimeSeriesChart = ({ data, metric = 'trips' }: { data: TimeSeriesData[], metric?: 'trips' | 'revenue' }) => {
    if (!data || data.length === 0) return null;

    const color = metric === 'revenue' ? '#22c55e' : '#4facfe';

    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    />
                    <YAxis
                        tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            fontSize: '10px'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey={metric}
                        stroke={color}
                        fillOpacity={1}
                        fill="url(#colorMetric)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
