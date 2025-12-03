import React, { useMemo } from 'react';

type RevenueChartProps = {
    labels: string[];
    dataset: number[];
    title?: string;
    loading?: boolean;
    formatter?: (value: number) => string;
};

const RevenueChart: React.FC<RevenueChartProps> = ({ labels, dataset, title, loading, formatter }) => {
    const maxValue = useMemo(() => Math.max(...dataset, 0), [dataset]);

    // build simple SVG line path
    const path = useMemo(() => {
        if (labels.length === 0) return '';
        const width = Math.max(400, labels.length * 60);
        const height = 260;
        const padding = 30;
        const xStep = labels.length > 1 ? (width - padding * 2) / (labels.length - 1) : 0;
        const usableHeight = height - padding * 2;

        return dataset
            .map((value, i) => {
                const x = padding + i * xStep;
                const y = maxValue > 0 ? height - padding - (value / maxValue) * usableHeight : height - padding;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    }, [labels, dataset, maxValue]);

    return (
        <div className="flex h-full flex-col">
            <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">{title ?? 'Doanh thu'}</h2>
                {loading && <span className="text-xs text-gray-400">Đang tải…</span>}
            </header>

            <div className="relative flex-1 overflow-x-auto">
                {labels.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                        Không có dữ liệu trong khoảng thời gian đã chọn.
                    </div>
                ) : (
                    <svg width={Math.max(400, labels.length * 60)} height={300} viewBox={`0 0 ${Math.max(400, labels.length * 60)} 300`}>
                        {/* grid lines */}
                        <line x1="30" y1="30" x2={Math.max(400, labels.length * 60) - 20} y2="30" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="30" y1="270" x2={Math.max(400, labels.length * 60) - 20} y2="270" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="30" y1="30" x2="30" y2="270" stroke="#e5e7eb" strokeWidth="1" />

                        {/* area under line */}
                        <path
                            d={`${path} L ${Math.max(400, labels.length * 60) - 30} 270 L 30 270 Z`}
                            fill="rgba(10,193,239,0.12)"
                            stroke="none"
                        />

                        {/* line */}
                        <path d={path} fill="none" stroke="#0AC1EF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

                        {/* points */}
                        {dataset.map((value, i) => {
                            const width = Math.max(400, labels.length * 60);
                            const padding = 30;
                            const xStep = labels.length > 1 ? (width - padding * 2) / (labels.length - 1) : 0;
                            const x = padding + i * xStep;
                            const y = maxValue > 0 ? 300 - padding - (value / maxValue) * (300 - padding * 2) : 300 - padding;
                            return <circle key={i} cx={x} cy={y} r={4} fill="#0AC1EF" stroke="#fff" strokeWidth={1} />;
                        })}
                    </svg>
                )}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-gray-500">
                {labels.map((label, idx) => (
                    <span key={idx} className="truncate">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default RevenueChart;