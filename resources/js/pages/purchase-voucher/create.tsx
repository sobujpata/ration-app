import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, LoaderCircle, Search, Ticket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { lookup as purchaseVoucherLookup, store as purchaseVoucherStore } from '@/routes/purchase-vouchers';

type Voucher = {
    id: number;
    personnel_type: string;
    category: string;
    product_qty: number;
    total_price: number;
};

type PreviousEntry = {
    name: string;
    phone: string;
    voucher_id: number;
    personnel_type: string;
    category: string;
    same_month: boolean;
};

type CreateProps = { vouchers: Voucher[] };
type PurchaseVoucherForm = {
    service_no: string;
    name: string;
    phone: string;
    voucher_id: string;
    for_month: string;
    raising_cost: string;
    status: string;
};

const currentMonth = new Date().toISOString().slice(0, 7);

export default function Create({ vouchers }: CreateProps) {
    const [previousEntry, setPreviousEntry] = useState<PreviousEntry | null>(null);
    const [lookupState, setLookupState] = useState<'idle' | 'searching' | 'found' | 'new'>('idle');
    const [lookupError, setLookupError] = useState<string | null>(null);
    const [voucherSearch, setVoucherSearch] = useState('');
    const [reviewed, setReviewed] = useState(false);
    const { data, setData, post, processing, errors } = useForm<PurchaseVoucherForm>({
        service_no: '',
        name: '',
        phone: '',
        voucher_id: '',
        for_month: currentMonth,
        raising_cost: '0',
        status: 'pending',
    });

    useEffect(() => {
        const serviceNo = data.service_no.trim();

        setPreviousEntry(null);
        setReviewed(false);
        setLookupError(null);

        if (!serviceNo) {
            setLookupState('idle');
            return;
        }

        setLookupState('searching');
        const controller = new AbortController();
        const timeout = window.setTimeout(() => {
            fetch(purchaseVoucherLookup.url({ query: { service_no: serviceNo, for_month: data.for_month } }), {
                headers: { Accept: 'application/json' },
                signal: controller.signal,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Unable to search previous entries.');
                    }

                    return response.json() as Promise<({ found: false } | (PreviousEntry & { found: true }))>;
                })
                .then((result) => {
                    if (!result.found) {
                        setLookupState('new');
                        return;
                    }

                    setPreviousEntry(result);
                    setData('name', result.name);
                    setData('phone', result.phone);
                    setData('voucher_id', String(result.voucher_id));
                    setLookupState('found');
                })
                .catch((error: unknown) => {
                    if (error instanceof DOMException && error.name === 'AbortError') {
                        return;
                    }

                    setLookupState('idle');
                });
        }, 400);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [data.for_month, data.service_no, setData]);

    const selectedVoucher = useMemo(
        () => vouchers.find((voucher) => String(voucher.id) === data.voucher_id),
        [data.voucher_id, vouchers],
    );
    const filteredVouchers = useMemo(() => {
        const search = voucherSearch.trim().toLowerCase();

        if (!search) {
            return vouchers;
        }

        return vouchers.filter((voucher) => String(voucher.id) === data.voucher_id || [voucher.id, voucher.personnel_type, voucher.category]
            .some((value) => String(value).toLowerCase().includes(search)));
    }, [data.voucher_id, voucherSearch, vouchers]);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(purchaseVoucherStore.url());
    };

    return (
        <>
            <Head title="Create purchase voucher" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-sky-950 dark:bg-black">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                <Ticket className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Purchase voucher management</p>
                                <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Create purchase voucher</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter a service number to reuse the latest recipient details.</p>
                            </div>
                        </div>
                        <Link href="/purchase-vouchers" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900">
                            <ArrowLeft className="size-4" />Back
                        </Link>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-sky-950 dark:bg-black">
                        <div className="mb-5 flex items-center gap-3">
                            <Search className="size-5 text-indigo-600" />
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Recipient details</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Existing service numbers are filled from their latest entry.</p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="service_no">Service no</Label>
                                <div className="relative">
                                    <Input id="service_no" value={data.service_no} onChange={(event) => setData('service_no', event.target.value)} required maxLength={10} />
                                    {lookupState === 'searching' && <LoaderCircle className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400" />}
                                </div>
                                <InputError message={errors.service_no} />
                                {lookupState === 'found' && previousEntry && (previousEntry.same_month
                                    ? <p className="text-sm text-red-600 dark:text-red-400">This service number already has an entry for the selected month. Submission is not allowed.</p>
                                    : <p className="text-sm text-green-600 dark:text-green-400">Previous entry found. Recipient details were filled automatically.</p>)}
                                {lookupState === 'new' && <p className="text-sm text-slate-500 dark:text-slate-400">No previous entry found. Enter new recipient details.</p>}
                                {lookupError && <p className="text-sm text-red-600 dark:text-red-400">{lookupError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} required maxLength={100} />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={data.phone} onChange={(event) => setData('phone', event.target.value)} required maxLength={20} />
                                <InputError message={errors.phone} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="for_month">Month</Label>
                                <Input id="for_month" type="month" value={data.for_month} onChange={(event) => setData('for_month', event.target.value)} required />
                                <InputError message={errors.for_month} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="raising_cost">Raising cost</Label>
                                <Input id="raising_cost" type="number" min="0" step="0.01" value={data.raising_cost} onChange={(event) => setData('raising_cost', event.target.value)} required />
                                <InputError message={errors.raising_cost} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(event) => setData('status', event.target.value)}
                                    required
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="recieved">Recieved</option>
                                    <option value="processed">Processed</option>
                                    <option value="out-for-delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="payment">Payment</option>
                                    <option value="complete">Complete</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-sky-950 dark:bg-black">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-slate-100">Voucher category</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search by category, personnel type, or voucher number.</p>
                            </div>
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="search"
                                    value={voucherSearch}
                                    onChange={(event) => setVoucherSearch(event.target.value)}
                                    placeholder="Search voucher category..."
                                    aria-label="Search voucher category"
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <select
                            id="voucher_id"
                            value={data.voucher_id}
                            onChange={(event) => { setData('voucher_id', event.target.value); setReviewed(false); }}
                            required
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                        >
                            <option value="">Select voucher category</option>
                            {filteredVouchers.map((voucher) => <option key={voucher.id} value={voucher.id}>#{voucher.id} - {voucher.personnel_type} - {voucher.category}</option>)}
                        </select>
                        {filteredVouchers.length === 0 && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No voucher categories match your search.</p>}
                        <InputError message={errors.voucher_id} />
                        {selectedVoucher && <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm dark:border-indigo-900 dark:bg-indigo-950/30"><span className="font-semibold text-indigo-800 dark:text-indigo-200">#{selectedVoucher.id} - {selectedVoucher.category}</span><span className="ml-3 text-indigo-700 dark:text-indigo-300">{selectedVoucher.personnel_type} · {selectedVoucher.product_qty} products · Total {selectedVoucher.total_price.toFixed(2)}</span></div>}
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-sky-950 dark:bg-black">
                        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Final check</h2>
                        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {([['Service no', data.service_no], ['Name', data.name], ['Phone', data.phone], ['Voucher', selectedVoucher ? `#${selectedVoucher.id} - ${selectedVoucher.category}` : 'Not selected'], ['Voucher total', selectedVoucher ? selectedVoucher.total_price.toFixed(2) : '0.00'], ['Raising cost', Number(data.raising_cost || 0).toFixed(2)], ['Initial payment', selectedVoucher ? Math.max(0, selectedVoucher.total_price - Number(data.raising_cost || 0)).toFixed(2) : '0.00']] as const).map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950"><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{value || '—'}</dd></div>)}
                        </dl>
                        <label className="mt-5 flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                            <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} required className="mt-0.5 size-4 accent-indigo-600" />
                            <span>I checked the service number, recipient details, and voucher category.</span>
                        </label>
                        <InputError message={errors.status} />
                        <div className="mt-6 flex justify-end">
                            <Button type="submit" disabled={processing || !reviewed || !selectedVoucher || Boolean(previousEntry?.same_month)} className="min-w-44 bg-green-600 text-white hover:bg-green-700">
                                <Check className="size-4" />{processing ? 'Submitting...' : 'Submit purchase voucher'}
                            </Button>
                        </div>
                    </section>
                </form>
            </div>
        </>
    );
}

Create.layout = { breadcrumbs: [{ title: 'Purchase vouchers', href: '/purchase-vouchers' }, { title: 'Create purchase voucher', href: '/purchase-vouchers/create' }] };
