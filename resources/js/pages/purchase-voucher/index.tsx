import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type FatchData = {
    id: number;
    service_no: string;
    name: string;
    phone: string;
    voucher_category: string;
    total_price: number;
    for_month: string;
    status: string;
    created_by: string;
};

const statusOptions = [
    { value: 'processed', label: 'Processed', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300' },
    { value: 'pending', label: 'Pending', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-950 dark:text-yellow-300' },
    { value: 'recieved', label: 'Recieved', className: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-300' },
    { value: 'payment', label: 'Payment', className: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-300' },
    { value: 'complete', label: 'Complete', className: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-300' },
];

const statusOption = (status: string) => statusOptions.find((option) => option.value === status) ?? {
    value: status,
    label: status,
    className: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
};


export default function Index() {
    const [datas, setData] = useState<FatchData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusVoucher, setStatusVoucher] = useState<FatchData | null>(null);
    const pageSize = 10;
    const statusForm = useForm({ status: '' });

    const filteredFatchData = datas.filter((datas) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) {
            return true;
        }

        return [
            datas.service_no,
            datas.name,
            datas.phone,
            datas.voucher_category,
            datas.total_price,
            datas.for_month,
            datas.status,
            datas.created_by
        ].some((value) => value?.toString().toLowerCase().includes(normalizedSearch));
    });
    const totalPages = Math.max(1, Math.ceil(filteredFatchData.length / pageSize));
    const paginatedFatchData = filteredFatchData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
    );

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this prodicts?');

        if (!confirmed) {
            return;
        }

        try {
            const csrfToken =
                document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ??
                document.cookie
                    .split('; ')
                    .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
                    ?.split('=')
                    .slice(1)
                    .join('=') ??
                '';

            const response = await fetch(`/purchase-vouchers/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken, 'X-XSRF-TOKEN': csrfToken } : {}),
                },
            });

            if (!response.ok) {
                const message = await response.text();

                throw new Error(message || 'Failed to delete data.');
            }

            setData((currentFatchData) => currentFatchData.filter((data) => data.id !== id));
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete data.');
        }
    };

    const openStatusDialog = (voucher: FatchData) => {
        setStatusVoucher(voucher);
        statusForm.setData('status', voucher.status);
        statusForm.clearErrors();
    };

    const updateStatus = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!statusVoucher) {
            return;
        }

        statusForm.put(`/purchase-vouchers/${statusVoucher.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setData((currentData) => currentData.map((data) => data.id === statusVoucher.id
                    ? { ...data, status: statusForm.data.status }
                    : data));
                setStatusVoucher(null);
            },
        });
    };

    useEffect(() => {
        fetch('/purchase-vouchers-list')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load user list.');
                }

                return response.json();
            })
            .then((data: FatchData[]) => setData(data))
            .catch((fetchError) => setError(String(fetchError)))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <>
            <Head title="Purchase Vouchers management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:bg-black dark:border-sky-950">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-200">Administration</p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Purchase Vouchers management</h1>
                        </div>

                        <Link
                            href="/purchase-vouchers/create"
                            className="inline-flex items-center justify-center rounded-md dark:bg-indiogo-800 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            as="button"
                        >
                            <Plus className="size-4" />Add New
                        </Link>
                    </div>
                </div>

                {error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                <div className="rounded-2xl border border-slate-200 dark:bg-black dark:border-sky-950 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-end">
                        <Input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search ..."
                            className="focus:border-sky-950"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:bg-black dark:border-sky-950 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm dark:text-slate-100 text-slate-700">
                            <thead className="dark:bg-black dark:text-slate-100 bg-slate-100 text-slate-700">
                                <tr>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">#</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Service No</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Name</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Phone</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Voucher Category</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Total Price</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Month</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Status</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Created By</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-center text-sm text-slate-500">
                                            Loading ...
                                        </td>
                                    </tr>
                                ) : filteredFatchData.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-center text-sm text-slate-500">
                                            {searchTerm ? 'No match your search.' : 'No found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedFatchData.map((data, index) => (
                                        <tr key={data.id} className="transition dark:hover:bg-slate-900 hover:bg-slate-50">
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 text-center font-medium dark:text-slate-100 text-slate-600">
                                                {(currentPage - 1) * pageSize + index + 1}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                {data.service_no}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                {data.name}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                {data.phone}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                {data.voucher_category}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                {Number(data.total_price).toFixed(2)}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                {data.for_month}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                <button
                                                    type="button"
                                                    onClick={() => openStatusDialog(data)}
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition ${statusOption(data.status).className}`}
                                                >
                                                    {statusOption(data.status).label}
                                                </button>
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                {data.created_by}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/purchase-vouchers/${data.id}/view`}
                                                        className="inline-flex items-center justify-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-300"
                                                    >
                                                        <Eye className="size-3.5" />
                                                    </Link>
                                                    <Link
                                                        href={`/purchase-vouchers/${data.id}/edit`}
                                                        className="inline-flex items-center justify-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(data.id)}
                                                        className="inline-flex items-center justify-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-500"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <nav className="flex flex-wrap justify-center gap-2 border-t border-slate-200 px-4 py-4 dark:border-slate-700" aria-label="prodicts pagination">
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${page === currentPage ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                                    aria-current={page === currentPage ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            ))}
                        </nav>
                    )}
                </div>
            </div>
            <Dialog open={statusVoucher !== null} onOpenChange={(open) => !open && setStatusVoucher(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change purchase voucher status</DialogTitle>
                        <DialogDescription>
                            Update the status for {statusVoucher?.service_no} - {statusVoucher?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateStatus} className="space-y-5">
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Select status</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {statusOptions.map((option) => (
                                    <button
                                        type="button"
                                        key={option.value}
                                        onClick={() => statusForm.setData('status', option.value)}
                                        className={`rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${option.className} ${statusForm.data.status === option.value ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-black' : ''}`}
                                        aria-pressed={statusForm.data.status === option.value}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            {statusForm.errors.status && <p className="text-sm text-red-600">{statusForm.errors.status}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setStatusVoucher(null)}><X className="size-4" />Cancel</Button>
                            <Button type="submit" disabled={statusForm.processing}><Pencil className="size-4" />Save status</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Purchase Vouchers management',
            href: '/purchase-vouchers',
        },
    ],
};
