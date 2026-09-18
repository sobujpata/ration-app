import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { deliver as purchaseVoucherDeliver } from '@/routes/purchase-vouchers';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

type VoucherProduct = {
    id: number;
    product_id: number;
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
    total_price: number;
    raising_cost: number;
    total_payment: number;
    delivered_products: DeliveredProduct[];
};

type DeliveredProduct = {
    id: number;
    product_id: number;
    name: string;
    unit: string;
    quantity: number;
    unit_price: number;
    total_price: number;
};

const statusLabels: Record<string, string> = {
    processed: 'Processed',
    pending: 'Pending',
    recieved: 'Recieved',
    delivered: 'Delivered',
    payment: 'Payment',
    complete: 'Complete',
};

export default function View({ purchaseVoucher }: { purchaseVoucher: PurchaseVoucher }) {
    const voucher = purchaseVoucher.voucher;
    const activeProducts = voucher.products.filter((product) => product.status);
    const existingDelivery = purchaseVoucher.delivered_products.reduce<Record<number, number>>((totals, product) => {
        totals[product.product_id] = (totals[product.product_id] ?? 0) + product.quantity;
        return totals;
    }, {});
    const [deliveryQuantities, setDeliveryQuantities] = useState<Record<number, string>>(
        Object.fromEntries(activeProducts.map((product) => [product.product_id, String(existingDelivery[product.product_id] ?? '')])),
    );
    const [checkedProducts, setCheckedProducts] = useState<Record<number, boolean>>(
        Object.fromEntries(activeProducts.map((product) => [product.product_id, (existingDelivery[product.product_id] ?? 0) > 0])),
    );
    const [savingDelivery, setSavingDelivery] = useState(false);
    const voucherGrandTotal = useMemo(() => activeProducts.reduce((total, product) => total + product.line_total, 0), [activeProducts]);
    const deliveredGrandTotal = useMemo(() => activeProducts.reduce((total, product) => {
        const quantity = Number(deliveryQuantities[product.product_id] || 0);
        return total + (checkedProducts[product.product_id] ? product.purchase_unit_price * quantity : 0);
    }, 0), [activeProducts, checkedProducts, deliveryQuantities]);
    const calculatedPayment = Math.max(0, voucherGrandTotal - purchaseVoucher.raising_cost - deliveredGrandTotal);
    const [totalPayment, setTotalPayment] = useState(String(purchaseVoucher.total_payment ?? calculatedPayment));
    const hasMounted = useRef(false);
    const deliveryForm = useForm({
        products: [] as { product_id: number; quantity: number }[],
        total_payment: '',
    });

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        setTotalPayment(String(calculatedPayment.toFixed(2)));
    }, [calculatedPayment]);

    const submitDelivery = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const products = activeProducts
            .filter((product) => checkedProducts[product.product_id])
            .map((product) => ({
                product_id: product.product_id,
                quantity: Number(deliveryQuantities[product.product_id] ?? 0),
            }))
            .filter((product) => Number.isFinite(product.quantity) && product.quantity > 0);

        router.post(purchaseVoucherDeliver.url(purchaseVoucher.id), {
            products,
            total_payment: Number(totalPayment || 0),
        }, {
            preserveScroll: true,
            onStart: () => {
                setSavingDelivery(true);
                deliveryForm.clearErrors();
            },
            onError: (errors) => deliveryForm.setError(errors),
            onFinish: () => setSavingDelivery(false),
        });
    };

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
                        <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-300"><tr><th className="px-4 py-3 font-semibold">Delivered</th><th className="px-4 py-3 font-semibold">Product name</th><th className="px-4 py-3 font-semibold">Unit</th><th className="px-4 py-3 text-right font-semibold">Voucher quantity</th><th className="px-4 py-3 text-right font-semibold">Delivered quantity</th><th className="px-4 py-3 text-right font-semibold">Unit price</th><th className="px-4 py-3 text-right font-semibold">Voucher total price</th><th className="px-4 py-3 text-right font-semibold">Delivered total price</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-sky-950">{activeProducts.map((product) => { const quantity = Number(deliveryQuantities[product.product_id] || 0); return <tr key={product.id}><td className="px-4 py-3"><input type="checkbox" checked={Boolean(checkedProducts[product.product_id])} onChange={(event) => {
                             setCheckedProducts((current) => ({ ...current, [product.product_id]: event.target.checked }));
                             if (!event.target.checked) {
                                 setDeliveryQuantities((current) => ({ ...current, [product.product_id]: '' }));
                             }
                         }} className="size-4 accent-indigo-600" aria-label={`Deliver ${product.name}`} /></td><td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{product.name}</td><td className="px-4 py-3 text-slate-600 dark:text-slate-300">{product.unit}</td><td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{product.quantity.toFixed(3)}</td><td className="px-4 py-3 text-right"><Input type="number" min="0.001" max={product.quantity} step="0.001" value={deliveryQuantities[product.product_id] ?? ''} onChange={(event) => setDeliveryQuantities((current) => ({ ...current, [product.product_id]: event.target.value }))} disabled={!checkedProducts[product.product_id]} className="ml-auto w-28 text-right" aria-label={`Delivered quantity for ${product.name}`} /></td><td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{product.purchase_unit_price.toFixed(2)}</td><td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{product.line_total.toFixed(2)}</td><td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-slate-100">{(checkedProducts[product.product_id] ? product.purchase_unit_price * quantity : 0).toFixed(2)}</td></tr>; })}{activeProducts.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No active products in this voucher.</td></tr>}</tbody></table></div>
                        <div className="mt-4 overflow-x-auto"><table className="ml-auto min-w-full max-w-xl text-sm"><tfoot className="border-t border-slate-200 dark:border-sky-950"><tr><th className="px-4 py-2 text-left font-medium text-slate-500">Voucher cost</th><td className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">{purchaseVoucher.raising_cost.toFixed(2)}</td></tr><tr><th className="px-4 py-2 text-left font-medium text-slate-500">Voucher grand total</th><td className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">{voucherGrandTotal.toFixed(2)}</td></tr><tr><th className="px-4 py-2 text-left font-medium text-slate-500">Delivered grand total</th><td className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">{deliveredGrandTotal.toFixed(2)}</td></tr><tr className="bg-indigo-50 dark:bg-indigo-950/30"><th className="px-4 py-3 text-left text-indigo-700 dark:text-indigo-300">Total payment</th><td className="px-4 py-3 text-right"><Input type="number" min="0" step="0.01" value={totalPayment} onChange={(event) => setTotalPayment(event.target.value)} className="ml-auto w-36 text-right text-lg font-bold text-indigo-900 dark:text-indigo-100" aria-label="Total payment" /><InputError message={deliveryForm.errors.total_payment} /></td></tr></tfoot></table></div>
                    </section>

                    <section className="border-t border-slate-200  dark:border-sky-950 print:hidden">
                        <form onSubmit={submitDelivery} className="">
                            <InputError message={deliveryForm.errors.products} />
                            <Button type="submit" disabled={savingDelivery} className="mt-4 bg-indigo-600 text-white hover:bg-indigo-500">{savingDelivery ? 'Saving...' : 'Save delivered products'}</Button>
                        </form>
                    </section>

                    <footer className="flex flex-col gap-2 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-sky-950 sm:flex-row sm:justify-between"><span>Created by: <strong className="text-slate-700 dark:text-slate-200">{purchaseVoucher.created_by}</strong></span><span>Thank you.</span></footer>
                </article>
            </div>
        </>
    );
}

View.layout = { breadcrumbs: [{ title: 'Purchase vouchers', href: '/purchase-vouchers' }, { title: 'Purchase voucher invoice', href: '#' }] };
