import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PurchaseVoucher = {
    id: number;
    service_no: string;
    name: string;
    phone: string;
    voucher_id: number;
    voucher_category: string;
    personnel_type: string;
    for_month: string;
    status: string;
};
type VoucherOption = { id: number; personnel_type: string; category: string };

const statusOptions = [
    { value: 'processed', label: 'Processed' },
    { value: 'pending', label: 'Pending' },
    { value: 'recieved', label: 'Recieved' },
    { value: 'payment', label: 'Payment' },
    { value: 'complete', label: 'Complete' },
];

export default function Edit({ purchaseVoucher, vouchers }: { purchaseVoucher: PurchaseVoucher; vouchers: VoucherOption[] }) {
    return (
        <>
            <Head title={`Edit purchase voucher #${purchaseVoucher.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-sky-950 dark:bg-black">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Purchase voucher #{purchaseVoucher.id}</p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Edit purchase voucher</h1>
                        </div>
                        <Link href="/purchase-vouchers" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"><ArrowLeft className="size-4" />Back to purchase vouchers</Link>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-sky-950 dark:bg-black">
                    <Form action={`/purchase-vouchers/${purchaseVoucher.id}`} method="put" className="space-y-6">
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2"><Label htmlFor="service_no">Service no</Label><Input id="service_no" name="service_no" defaultValue={purchaseVoucher.service_no} required maxLength={10} /><InputError message={errors.service_no} /></div>
                                    <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={purchaseVoucher.name} required maxLength={100} /><InputError message={errors.name} /></div>
                                    <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" defaultValue={purchaseVoucher.phone} required maxLength={20} /><InputError message={errors.phone} /></div>
                                    <div className="space-y-2"><Label htmlFor="for_month">Month</Label><Input id="for_month" name="for_month" type="month" defaultValue={purchaseVoucher.for_month} required /><InputError message={errors.for_month} /></div>
                                    <div className="space-y-2"><Label htmlFor="voucher_id">Voucher category</Label>
                                    <select id="voucher_id" name="voucher_id" defaultValue={purchaseVoucher.voucher_id} required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-black dark:text-slate-100">
                                        {vouchers.map((voucher) => 
                                        <option key={voucher.id} value={voucher.id}>#{voucher.id} - {voucher.personnel_type} - {voucher.category}</option>)}
                                    </select>
                                    <InputError message={errors.voucher_id} /></div>
                                    <div className="space-y-2"><Label htmlFor="status">Status</Label><select id="status" name="status" defaultValue={purchaseVoucher.status} required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-black dark:text-slate-100">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><InputError message={errors.status} /></div>
                                </div>
                                <div className="flex justify-end"><Button type="submit" disabled={processing} className="min-w-40 bg-green-600 text-white hover:bg-green-700"><Save className="size-4" />{processing ? 'Saving...' : 'Update purchase voucher'}</Button></div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

Edit.layout = { breadcrumbs: [{ title: 'Purchase vouchers', href: '/purchase-vouchers' }, { title: 'Edit purchase voucher', href: '#' }] };
