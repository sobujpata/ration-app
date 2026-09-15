import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

type VoucherProduct = {
    id: number;
    name: string;
    unit: string;
    quantity: string | number;
    purchase_unit_price: string | number;
    line_total: number;
    status: boolean;
};

type Voucher = {
    id: number;
    personnel_type: string;
    category: string;
    product_qty: number;
    total_price: number;
    products: VoucherProduct[];
};

export default function View({ voucher }: { voucher: Voucher }) {
    return (
        <>
            <Head title={`Voucher #${voucher.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-sky-950 dark:bg-black">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Voucher #{voucher.id}</p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Voucher details</h1>
                        </div>
                        <Link href="/vouchers" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"><ArrowLeft className="size-4" />Back to vouchers</Link>
                    </div>
                    <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950"><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Personnel type</dt><dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{voucher.personnel_type}</dd></div>
                        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950"><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Voucher category</dt><dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{voucher.category}</dd></div>
                        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/40"><dt className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Voucher total</dt><dd className="mt-1 text-xl font-semibold text-indigo-700 dark:text-indigo-200">{voucher.total_price.toFixed(2)}</dd></div>
                    </dl>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-sky-950 dark:bg-black">
                    <div className="border-b border-slate-200 px-5 py-4 dark:border-sky-950"><h2 className="font-semibold text-slate-900 dark:text-slate-100">Voucher products ({voucher.product_qty})</h2></div>
                    <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300"><tr><th className="px-5 py-3 font-semibold">Product</th><th className="px-5 py-3 font-semibold">Unit</th><th className="px-5 py-3 font-semibold">Quantity</th><th className="px-5 py-3 font-semibold">Purchase unit price</th><th className="px-5 py-3 font-semibold">Total price</th><th className="px-5 py-3 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-sky-950">{voucher.products.map((product) => <tr key={product.id}><td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">{product.name}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{product.unit}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{product.quantity}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{Number(product.purchase_unit_price).toFixed(2)}</td><td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">{product.line_total.toFixed(2)}</td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${product.status ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>{product.status ? 'Active' : 'Inactive'}</span></td></tr>)}</tbody></table></div>
                </div>
            </div>
        </>
    );
}

View.layout = { breadcrumbs: [{ title: 'Vouchers', href: '/vouchers' }, { title: 'Voucher details', href: '#' }] };
