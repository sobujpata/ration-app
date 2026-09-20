import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowRight,
    BadgeCheck,
    BarChart3,
    Box,
    ChevronRight,
    Clock3,
    PackageCheck,
    ReceiptText,
    ShoppingCart,
    Store,
    TrendingUp,
    Truck,
} from 'lucide-react';

const featureCards = [
    {
        icon: Truck,
        title: 'Fast delivery',
        description: 'Daily dispatch and reliable doorstep supply for your ration stock.',
    },
    {
        icon: PackageCheck,
        title: 'Quality assurance',
        description: 'Carefully selected products with proper packaging and freshness checks.',
    },
    {
        icon: BarChart3,
        title: 'Daily sales insights',
        description: 'Track purchases, sales, and voucher activity with clear reporting.',
    },
    {
        icon: Store,
        title: 'Retail + wholesale',
        description: 'Serve individual customers and larger purchase voucher customers together.',
    },
];

const stats = [
    { label: 'Products in stock', value: '2.4K+' },
    { label: 'Daily transactions', value: '468' },
    { label: 'Voucher customers', value: '1,250' },
    { label: 'Happy buyers', value: '92%' },
];

const productGroups = [
    { name: 'Rice', count: '220 bags', color: 'bg-amber-100 text-amber-700' },
    { name: 'Oil', count: '190 packs', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Sugar', count: '160 sacks', color: 'bg-orange-100 text-orange-700' },
    { name: 'Pulses', count: '140 packs', color: 'bg-violet-100 text-violet-700' },
    { name: 'Salt', count: '180 packets', color: 'bg-sky-100 text-sky-700' },
    { name: 'Flour', count: '210 sacks', color: 'bg-rose-100 text-rose-700' },
];

const steps = [
    {
        icon: ShoppingCart,
        title: 'Create purchase orders',
        detail: 'Add ration items, quantities, and supplier cost quickly from one place.',
    },
    {
        icon: ReceiptText,
        title: 'Track voucher sales',
        detail: 'Monitor delivery, payment, and due amounts for every ration voucher.',
    },
    {
        icon: TrendingUp,
        title: 'Manage sales growth',
        detail: 'View business movement with live totals for today’s purchases and sales.',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Ration Shop | Purchase & Sales" />

            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_30%)]" />
                <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-6 lg:py-28">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-8">
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                                Trusted ration supply partner
                            </Badge>

                            <div className="space-y-5">
                                <h1 className="max-w-xl text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
                                    Smart ration purchase and sales for your local shop.
                                </h1>
                                <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                                    Manage inventory, customer vouchers, daily sales, and product movement from one efficient storefront built for ration businesses.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link href="/register">
                                    <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                                        Start buying
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="border-slate-300 text-slate-800 dark:border-slate-700 dark:text-slate-100">
                                        Seller login
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                                    Secure billing
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock3 className="h-4 w-4 text-amber-500" />
                                    Daily updates
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-sky-600" />
                                    Sales tracking
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-200/60 via-amber-100/40 to-sky-200/50 blur-2xl" />
                            <div className="relative rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.14)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                                <div className="rounded-[1.5rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-amber-400 p-5 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-emerald-100">Today&apos;s overview</p>
                                            <h2 className="mt-2 text-3xl font-bold">৳ 1,28,450</h2>
                                        </div>
                                        <div className="rounded-2xl bg-white/15 p-3">
                                            <BarChart3 className="h-7 w-7" />
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-2xl bg-white/10 p-3">
                                            <p className="text-emerald-100">Purchases</p>
                                            <p className="mt-1 text-xl font-semibold">৳ 48,200</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/10 p-3">
                                            <p className="text-emerald-100">Sales</p>
                                            <p className="mt-1 text-xl font-semibold">৳ 80,250</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-4">
                                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                                                <Box className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Stock</p>
                                                <p className="font-semibold text-slate-900 dark:text-white">1,440 items</p>
                                            </div>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                                            +12.4%
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {['Rice', 'Oil', 'Sugar', 'Salt'].map((item, index) => (
                                            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80">
                                                <div className="mb-2 h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                                                    <div
                                                        className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
                                                        style={{ width: `${68 + index * 8}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-20 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
                                <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-20 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="mb-10 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Why shops choose us</p>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                            Built for ration purchases, sales, and supply tracking
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {featureCards.map(({ icon: Icon, title, description }) => (
                            <Card key={title} className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xl">{title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-7">{description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-20 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-600">Popular products</p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                                Essential ration stock ready to move
                            </h2>
                        </div>
                        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                            Browse all items
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {productGroups.map((product) => (
                            <div key={product.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80">
                                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.color}`}>
                                    {product.name}
                                </div>
                                <div className="mt-5 rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-amber-100 p-4 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700">
                                    <div className="flex h-16 items-center justify-center rounded-xl bg-white/80 text-2xl font-black text-slate-900 shadow-sm dark:bg-slate-900/80 dark:text-white">
                                        {product.name.slice(0, 2)}
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{product.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-20 text-white">
                <div className="mx-auto max-w-7xl px-4 lg:px-6">
                    <div className="grid items-center gap-10 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">Simple workflow</p>
                            <h2 className="mt-3 text-3xl font-bold md:text-4xl">From purchase order to sale record in a few steps.</h2>
                        </div>
                        <div className="flex justify-start lg:justify-end">
                            <Link href="/login">
                                <Button size="lg" className="bg-white text-emerald-700 hover:bg-slate-100">
                                    Open dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {steps.map(({ icon: Icon, title, detail }, index) => (
                            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <p className="mb-2 text-sm font-semibold text-emerald-100">0{index + 1}</p>
                                <h3 className="text-xl font-semibold">{title}</h3>
                                <p className="mt-3 text-sm leading-7 text-emerald-50/90">{detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-20 dark:bg-slate-950">
                <div className="mx-auto max-w-5xl px-4 lg:px-6">
                    <Card className="border-emerald-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">Ready to manage your ration shop smarter?</CardTitle>
                            <CardDescription className="mt-2 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                                Keep purchase costs, sales revenue, voucher tracking, and inventory stock under control with one connected dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-center gap-4 pb-8 sm:flex-row">
                            <Link href="/register">
                                <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                                    Create account
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="border-slate-300 text-slate-800 dark:border-slate-700 dark:text-slate-100">
                                    Explore dashboard
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    );
}
