import { Input } from '@/components/ui/input';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type FatchData = {
    id: number;
    name: string;
    description: string;
    status: string | number | boolean | null;
};

const isActive = (status: string | number | boolean | null) => {
    const value = String(status).toLowerCase();

    return value === '1' || value === 'true' || value === 'active';
};

export default function Index() {
    const [datas, setData] = useState<FatchData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const filteredFatchData = datas.filter((datas) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) {
            return true;
        }

        return [
            datas.name,
            datas.description,
            
            datas.status,
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

            const response = await fetch(`/personnel-types/${id}`, {
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

    useEffect(() => {
        fetch('/personnel-types-list')
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
            <Head title="Personnel types management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:bg-black dark:border-sky-950">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-200">Administration</p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Personnel types management</h1>
                        </div>

                        <Link
                            href="/personnel-types/create"
                            className="inline-flex items-center justify-center rounded-md dark:bg-indiogo-800 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            as="button"
                        >
                            Add New
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
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Name</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Description</th>
                                    
                                    
                                    
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold">Status</th>
                                    <th className="dark:border-sky-950 border-b border-slate-200 px-4 py-3 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                                            Loading ...
                                        </td>
                                    </tr>
                                ) : filteredFatchData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
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
                                                {data.name}
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3 font-medium dark:text-slate-100 text-slate-900">
                                                {data.description}
                                            </td>
                                            
                                            
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${isActive(data.status) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}
                                                >
                                                    {isActive(data.status) ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="border-b dark:border-sky-950 border-slate-200 px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/personnel-types/${data.id}/edit`}
                                                        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(data.id)}
                                                        className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-500"
                                                    >
                                                        Delete
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
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Personnel types management',
            href: '/personnel-types',
        },
    ],
};
