import { Head } from '@inertiajs/react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { dashboard } from '@/routes';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Summary = {
    todayPurchases: number;
    todaySales: number;
    voucherPurchases: number;
};

type StockItem = {
    name: string;
    quantity: number;
};

type DashboardProps = {
    summary?: Summary;
    stockChart?: StockItem[];
};

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0,
    }).format(value);

const formatCount = (value: number): string => `${value.toLocaleString('en-BD')} items`;

export default function DashboardPage({ summary, stockChart }: DashboardProps) {
    const summaryData: Summary = summary ?? {
        todayPurchases: 0,
        todaySales: 0,
        voucherPurchases: 0,
    };

    const stockItems: StockItem[] = stockChart && stockChart.length > 0
        ? stockChart
        : [
              { name: 'Rice', quantity: 120 },
              { name: 'Oil', quantity: 85 },
              { name: 'Pulse', quantity: 62 },
              { name: 'Salt', quantity: 45 },
              { name: 'Sugar', quantity: 32 },
          ];

    const chartData = {
        labels: stockItems.map((item) => item.name),
        datasets: [
            {
                label: 'Stock Quantity',
                data: stockItems.map((item) => item.quantity),
                backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'],
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Overview</p>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Summary</h1>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-sm text-slate-500">Today&apos;s purchases</p>
                        <div className="mt-3 flex items-end justify-between gap-2">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(summaryData.todayPurchases)}
                            </span>
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                Today
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-sm text-slate-500">Today&apos;s sales</p>
                        <div className="mt-3 flex items-end justify-between gap-2">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(summaryData.todaySales)}
                            </span>
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                                Revenue
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-sm text-slate-500">Voucher purchases</p>
                        <div className="mt-3 flex items-end justify-between gap-2">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                {formatCount(summaryData.voucherPurchases)}
                            </span>
                            <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                                Vouchers
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Individual products stock</h2>
                            <p className="text-sm text-slate-500">Current available inventory by product</p>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </>
    );
}

DashboardPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
