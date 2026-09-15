import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, FileText, Search, Ticket } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Voucher = { id: number; personnel_type: string; category: string; product_qty: number; total_price: number };
type CreateProps = { vouchers: Voucher[] };
type PurchaseVoucherForm = { service_no: string; name: string; phone: string; voucher_id: string; for_month: string; status: string };

const statusOptions = [
    { value: 'processed', label: 'Processed' },
    { value: 'pending', label: 'Pending' },
    { value: 'recieved', label: 'Recieved' },
    { value: 'payment', label: 'Payment' },
    { value: 'complete', label: 'Complete' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function Create({ vouchers }: CreateProps) {
    const [step, setStep] = useState(1);
    const [voucherSearch, setVoucherSearch] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const { data, setData, post, processing, errors } = useForm<PurchaseVoucherForm>({
        service_no: '', name: '', phone: '', voucher_id: '', for_month: '', status: 'processed',
    });
    const selectedVoucher = useMemo(() => vouchers.find((voucher) => String(voucher.id) === data.voucher_id), [data.voucher_id, vouchers]);
    const filteredVouchers = useMemo(() => {
        const search = voucherSearch.trim().toLowerCase();
        if (!search) return vouchers;

        return vouchers.filter((voucher) => [voucher.id, voucher.personnel_type, voucher.category, voucher.product_qty, voucher.total_price]
            .some((value) => String(value).toLowerCase().includes(search)));
    }, [voucherSearch, vouchers]);
    const setField = (field: keyof PurchaseVoucherForm, value: string) => setData(field, value);
    const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); post('/purchase-vouchers'); };

    return (
        <>
            <Head title="Create purchase voucher" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-sky-950 dark:bg-black">
                    <div className="flex items-start gap-4"><div className="rounded-xl bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><Ticket className="size-6" /></div><div><p className="text-sm font-medium text-slate-500 dark:text-slate-300">Purchase voucher management</p><h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Create purchase voucher</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter the recipient details, choose a voucher, and review it before saving.</p></div></div>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">{['Recipient details', 'Choose voucher', 'Preview'].map((label, index) => { const number = index + 1; return <div key={label} className={`flex items-center gap-2 ${number <= step ? 'font-semibold text-indigo-600 dark:text-indigo-300' : 'text-slate-400'}`}><span className={`flex size-8 items-center justify-center rounded-full ${number <= step ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>{number}</span><span className="hidden sm:inline">{label}</span></div>; })}</div>
                <form ref={formRef} onSubmit={submit} className="space-y-6">
                    {step === 1 && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-950 dark:bg-black"><div className="mb-5 flex items-center gap-3"><FileText className="size-5 text-indigo-600" /><div><h2 className="font-semibold text-slate-900 dark:text-slate-100">Recipient details</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All fields are required.</p></div></div><div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2"><Label htmlFor="service_no">Service no</Label><Input id="service_no" value={data.service_no} onChange={(event) => setField('service_no', event.target.value)} required maxLength={10} /><InputError message={errors.service_no} /></div>
                        <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={data.name} onChange={(event) => setField('name', event.target.value)} required maxLength={100} /><InputError message={errors.name} /></div>
                        <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={data.phone} onChange={(event) => setField('phone', event.target.value)} required maxLength={20} /><InputError message={errors.phone} /></div>
                        <div className="space-y-2"><Label htmlFor="for_month">Month</Label><Input id="for_month" type="month" value={data.for_month} onChange={(event) => setField('for_month', event.target.value)} required /><InputError message={errors.for_month} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="status">Status</Label><select id="status" value={data.status} onChange={(event) => setField('status', event.target.value)} required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-black dark:text-slate-100">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><InputError message={errors.status} /></div>
                    </div><div className="mt-6 flex justify-end"><Button type="button" onClick={() => { if (formRef.current?.reportValidity()) setStep(2); }}>Next <ArrowRight className="size-4" /></Button></div></section>}
                    {step === 2 && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-950 dark:bg-black"><div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-semibold text-slate-900 dark:text-slate-100">Choose a voucher</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select one voucher template. Six vouchers are shown per row.</p></div><div className="relative w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="search" value={voucherSearch} onChange={(event) => setVoucherSearch(event.target.value)} placeholder="Search vouchers..." aria-label="Search vouchers" className="pl-9" /></div></div>
                        {vouchers.length === 0 ? <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-950">No vouchers are available. Create a voucher template first.</p> : filteredVouchers.length === 0 ? <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-950">No vouchers match your search.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{filteredVouchers.map((voucher) => <button type="button" key={voucher.id} onClick={() => setField('voucher_id', String(voucher.id))} className={`rounded-xl border p-4 text-left transition ${data.voucher_id === String(voucher.id) ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 dark:border-indigo-400 dark:bg-indigo-950/40' : 'border-slate-200 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-700'}`}><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Voucher #{voucher.id}</span>{data.voucher_id === String(voucher.id) && <Check className="size-4 text-indigo-600" />}</div><dl className="mt-3 space-y-2 text-xs text-slate-500 dark:text-slate-300"><div><dt>Personnel</dt><dd className="font-medium text-slate-700 dark:text-slate-200">{voucher.personnel_type}</dd></div><div><dt>Category</dt><dd className="font-medium text-slate-700 dark:text-slate-200">{voucher.category}</dd></div><div className="flex justify-between gap-2"><dt>Products</dt><dd className="font-medium">{voucher.product_qty}</dd></div><div className="flex justify-between gap-2"><dt>Total</dt><dd className="font-semibold text-indigo-700 dark:text-indigo-300">{voucher.total_price.toFixed(2)}</dd></div></dl></button>)}</div>}
                        <InputError message={errors.voucher_id} /><div className="mt-6 flex justify-between"><Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft className="size-4" />Back</Button><Button type="button" onClick={() => selectedVoucher && setStep(3)} disabled={!selectedVoucher}>Next <ArrowRight className="size-4" /></Button></div>
                    </section>}
                    {step === 3 && selectedVoucher && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-950 dark:bg-black"><div className="mb-5"><h2 className="font-semibold text-slate-900 dark:text-slate-100">Preview purchase voucher</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review the information before submitting.</p></div><dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[['Service no', data.service_no], ['Name', data.name], ['Phone', data.phone], ['Month', data.for_month], ['Status', statusOptions.find((option) => option.value === data.status)?.label ?? data.status], ['Voucher', `#${selectedVoucher.id} · ${selectedVoucher.category}`]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950"><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{value}</dd></div>)}</dl><div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm dark:border-indigo-900 dark:bg-indigo-950/30"><span className="font-semibold text-indigo-800 dark:text-indigo-200">Voucher #{selectedVoucher.id}</span><span className="ml-3 text-indigo-700 dark:text-indigo-300">{selectedVoucher.personnel_type} · {selectedVoucher.product_qty} products · Total {selectedVoucher.total_price.toFixed(2)}</span></div><div className="mt-6 flex justify-between"><Button type="button" variant="outline" onClick={() => setStep(2)}><ArrowLeft className="size-4" />Back</Button><Button type="submit" disabled={processing} className="bg-green-600 text-white hover:bg-green-700"><Check className="size-4" />{processing ? 'Submitting...' : 'Submit purchase voucher'}</Button></div></section>}
                </form>
            </div>
        </>
    );
}

Create.layout = { breadcrumbs: [{ title: 'Purchase vouchers', href: '/purchase-vouchers' }, { title: 'Create purchase voucher', href: '/purchase-vouchers/create' }] };
