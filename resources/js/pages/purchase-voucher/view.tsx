import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

type VoucherProduct = {
    id: number;
    name: string;
    unit: string;
    quantity: number;
    purchase_unit_price: number;
    line_total: number;
    status: boolean;
};

type PurchaseVoucher = {
    id: number;
    service_no: string;
    name: string;
    phone: string;
    for_month: string;
    status: string;
    created_by: string;
    voucher: {
        id: number | null;
        personnel_type: string;
        category: string;
        products: VoucherProduct[];
        total_price: number;
    };
};

const statusLabels: Record<string, string> = {
    processed: 'Processed',
    pending: 'Pending',
    recieved: 'Recieved',
    payment: 'Payment',
    complete: 'Complete',
};

export default function View({ purchaseVoucher }: { purchaseVoucher: PurchaseVoucher }) {
    const voucher = purchaseVoucher.voucher;
    const activeProducts = voucher.products.filter((product) => product.status);

    return (
        <>
            <Head title={`Purchase voucher #${purchaseVoucher.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6 print:bg-white print:p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <Link href="/purchase-vouchers" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"><ArrowLeft className="size-4" />Back to purchase vouchers</Link>
                    <Button type="button" onClick={() => window.print()} className="gap-2"><Printer className="size-4" />Print invoice</Button>
                </div>

                <article className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-sky-950 dark:bg-black sm:p-10 print:max-w-none print:border-0 print:p-0 print:shadow-none">
                    <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 dark:border-sky-950 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Purchase voucher</p>
                            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Invoice #{purchaseVoucher.id}</h1>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">For month: {purchaseVoucher.for_month}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                            <span className="mt-2 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{statusLabels[purchaseVoucher.status] ?? purchaseVoucher.status}</span>
                        </div>
                    </header>

                    <section className="grid gap-4 border-b border-slate-200 py-6 dark:border-sky-950 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recipient details</p><dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">Service no</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{purchaseVoucher.service_no}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{purchaseVoucher.name}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{purchaseVoucher.phone}</dd></div></dl></div>
                        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30"><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Voucher details</p><dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between gap-4"><dt className="text-indigo-700/70 dark:text-indigo-300/70">Voucher</dt><dd className="font-semibold text-indigo-900 dark:text-indigo-100">#{voucher.id ?? '—'}</dd></div><div className="flex justify-between gap-4"><dt className="text-indigo-700/70 dark:text-indigo-300/70">Personnel type</dt><dd className="font-semibold text-indigo-900 dark:text-indigo-100">{voucher.personnel_type}</dd></div><div className="flex justify-between gap-4"><dt className="text-indigo-700/70 dark:text-indigo-300/70">Category</dt><dd className="font-semibold text-indigo-900 dark:text-indigo-100">{voucher.category}</dd></div></dl></div>
                    </section>

                    <section className="py-6">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Voucher products</h2>
                        <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-300"><tr><th className="px-4 py-3 font-semibold">#</th><th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">Unit</th><th className="px-4 py-3 text-right font-semibold">Quantity</th><th className="px-4 py-3 text-right font-semibold">Unit price</th><th className="px-4 py-3 text-right font-semibold">Total</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-sky-950">{activeProducts.map((product, index) => <tr key={product.id}><td className="px-4 py-3 text-slate-500">{index + 1}</td><td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{product.name}</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">{product.unit}</td><td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{product.quantity}</td><td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{product.purchase_unit_price.toFixed(2)}</td><td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-slate-100">{product.line_total.toFixed(2)}</td></tr>)}{activeProducts.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No active products in this voucher.</td></tr>}</tbody></table></div>
                        <div className="mt-4 flex justify-end"><div className="w-full max-w-xs space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-sky-950"><div className="flex justify-between text-slate-500"><span>Active products</span><span>{activeProducts.length}</span></div><div className="flex justify-between text-lg font-bold text-slate-900 dark:text-slate-100"><span>Grand total</span><span>{Number(voucher.total_price).toFixed(2)}</span></div></div></div>
                    </section>

                    <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-sky-950 sm:flex-row sm:justify-between"><span>Created by: <strong className="text-slate-700 dark:text-slate-200">{purchaseVoucher.created_by}</strong></span><span>Thank you.</span></footer>
                </article>
            </div>
        </>
    );
}

View.layout = { breadcrumbs: [{ title: 'Purchase vouchers', href: '/purchase-vouchers' }, { title: 'Purchase voucher invoice', href: '#' }] };
