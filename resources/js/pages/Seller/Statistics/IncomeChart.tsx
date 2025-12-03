import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type Props = {
    revenue?: {
        labels?: string[];
        dataset?: number[];
    } | null;
};

export default function IncomeChart({ revenue }: Props) {
    if (!revenue) return <div className="text-gray-500">Không có dữ liệu</div>;

    const labels = revenue.labels ?? [];
    const dataset = revenue.dataset ?? [];

    if (labels.length === 0) return <div className="text-gray-500">Không có dữ liệu</div>;

    const data = {
        labels,
        datasets: [
            {
                label: 'Doanh thu',
                data: dataset.map((v: any) => Number(v ?? 0)),
                fill: true,
                backgroundColor: 'rgba(10,193,239,0.12)',
                borderColor: 'rgba(10,193,239,1)',
                pointBackgroundColor: 'rgba(10,193,239,1)',
                tension: 0.25,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true, position: 'top' as const },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const v = context.parsed.y ?? 0;
                        return 'Doanh thu: ' + Number(v).toLocaleString() + ' VND';
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: { maxRotation: 0, autoSkip: true },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: any) {
                        return Number(value).toLocaleString();
                    },
                },
            },
        },
    };

    return (
        <div className="w-full">
            <Line data={data} options={options} />
        </div>
    );
}