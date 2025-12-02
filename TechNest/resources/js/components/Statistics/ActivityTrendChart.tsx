import React, { useMemo } from 'react';

type ActivitySeries = {
    name: string;
    data: number[];
};

type ActivityTrendChartProps = {
    labels: string[];
    series: ActivitySeries[];
    title?: string;
    loading?: boolean;
};

const palette = ['#2563eb', '#16a34a', '#f97316', '#9333ea', '#ef4444'];

const ActivityTrendChart: React.FC<ActivityTrendChartProps> = ({ labels, series, title, loading }) => {
    const maxValue = useMemo(() => {
        const values = series.flatMap((item) => item.data);
        return Math.max(...values, 0);
    }, [series]);

    const pathForSeries = (data: number[]) => {
        if (labels.length === 0) return '';
        const width = 600;
        const height = 240;
        const padding = 30;
        const xStep = labels.length > 1 ? (width - padding * 2) / (labels.length - 1) : 0;
        const usableHeight = height - padding * 2;

        return data
            .map((value, index) => {
                const x = padding + index * xStep;
                const y =
                    maxValue > 0
                        ? height - padding - (value / maxValue) * usableHeight
                        : height - padding;
                return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
            })
            .join(' ');
    };

    return (
        <div className="flex h-full flex-col">
            <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">{title ?? 'Trends'}</h2>
                {loading && <span className="text-xs text-gray-400">Loading…</span>}
            </header>

            <div className="mb-3 flex flex-wrap gap-4 text-xs text-gray-500">
                {series.map((item, index) => (
                    <span key={item.name} className="flex items-center gap-2">
                        <span className="h-2 w-4 rounded-sm" style={{ backgroundColor: palette[index % palette.length] }} />
                        {item.name}
                    </span>
                ))}
            </div>

            <div className="relative flex-1 overflow-x-auto">
                <svg width={600} height={260} viewBox="0 0 600 260">
                    <line x1="30" y1="230" x2="580" y2="230" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="30" y1="30" x2="30" y2="230" stroke="#e5e7eb" strokeWidth="1" />

                    {series.map((item, index) => (
                        <path
                            key={item.name}
                            d={pathForSeries(item.data)}
                            fill="none"
                            stroke={palette[index % palette.length]}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                {labels.map((label) => (
                    <span key={label}>{label}</span>
                ))}
            </div>

            {series.length === 0 && !loading && (
                <div className="mt-4 text-center text-sm text-gray-400">Không có dữ liệu hoạt động.</div>
            )}
        </div>
    );
};

export default ActivityTrendChart;