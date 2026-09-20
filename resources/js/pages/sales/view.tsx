import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

type InvoiceProduct = {
    id: number;
    name: string;
    unit: string;
    sku: string | null;
    quantity: number;
    price: number;
    total: number;
};

type Invoice = {
    id: number;
    customer_name: string;
    grand_total: number;
    paid_amount: number;
    due_amount: number;
    status: string;
    created_at: string | null;
    products: InvoiceProduct[];
};

const money = (value: number) => value.toFixed(2);

export default function View({ invoice }: { invoice: Invoice }) {
    return (
        <>
            <Head title={`Invoice #${invoice.id}`} />
            <div className="flex min-h-full flex-1 flex-col gap-6 rounded-2xl p-4 md:p-6 print:bg-white print:p-0">
                <div className="flex items-center justify-between gap-3 print:hidden">
                    <Link href="/sales" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"><ArrowLeft className="size-4" />Back to sales</Link>
                    <Button type="button" onClick={() => window.print()} className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"><Printer className="size-4" />Print invoice</Button>
                </div>
                <article className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-sky-950 dark:bg-black sm:p-10 print:max-w-none print:border-0 print:p-0 print:shadow-none">
                    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
                        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Sales invoice</p><h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Invoice #{invoice.id}</h1><p className="mt-2 text-sm text-slate-500">{invoice.created_at ?? '—'}</p></div>
                        <div className="text-left sm:text-right"><p className="text-sm text-slate-500">Status</p><span className="mt-2 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold capitalize text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{invoice.status}</span></div>
                    </header>
                    <section className="grid gap-4 border-b border-slate-200 py-6 dark:border-slate-800 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</p><p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{invoice.customer_name}</p></div>
                        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30"><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Invoice total</p><p className="mt-2 text-2xl font-bold text-indigo-700 dark:text-indigo-200">{money(invoice.grand_total)}</p></div>
                    </section>
                    <section className="py-6">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Products</h2>
                        <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100 dark:bg-slate-950"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3 text-right">Quantity</th><th className="px-4 py-3 text-right">Unit price</th><th className="px-4 py-3 text-right">Total</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{invoice.products.map((product) => <tr key={product.id}><td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{product.name}</td><td className="px-4 py-3 text-slate-500">{product.sku ?? '—'}</td><td className="px-4 py-3 text-slate-500">{product.unit}</td><td className="px-4 py-3 text-right">{product.quantity}</td><td className="px-4 py-3 text-right">{money(product.price)}</td><td className="px-4 py-3 text-right font-semibold">{money(product.total)}</td></tr>)}</tbody></table></div>
                    </section>
                    <section className="ml-auto max-w-sm border-t border-slate-200 pt-4 text-sm dark:border-slate-800"><div className="flex justify-between py-1"><span className="text-slate-500">Grand total</span><span className="font-semibold">{money(invoice.grand_total)}</span></div><div className="flex justify-between py-1"><span className="text-slate-500">Paid amount</span><span className="font-semibold">{money(invoice.paid_amount)}</span></div><div className="flex justify-between py-2 text-lg font-bold text-amber-700 dark:text-amber-300"><span>Due amount</span><span>{money(invoice.due_amount)}</span></div></section>
                </article>
            </div>
        </>
    );
}

View.layout = { breadcrumbs: [{ title: 'Sales', href: '/sales' }, { title: 'Invoice', href: '#' }] };
