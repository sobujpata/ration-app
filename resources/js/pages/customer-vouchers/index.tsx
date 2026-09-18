import { Head, useForm } from '@inertiajs/react';
import {
    CalendarDays,
    CircleDollarSign,
    LoaderCircle,
    Search,
    Ticket,
    UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { order as customerVoucherOrder } from '@/routes/customer-vouchers';
import type { FormEvent } from 'react';

type CustomerVoucher = {
    id: number;
    service_no: string;
    name: string;
    phone: string;
    personnel_type: string;
    category: string;
    for_month: string | null;
    total_price: number;
    raising_cost: number;
    total_payment: number;
    status: string;
    products: VoucherProduct[];
};

type VoucherProduct = {
    product_id: number;
    name: string;
    unit: string;
    quantity: number;
    unit_price: number;
};

const statusStyles: Record<string, string> = {
    processed:
        'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300',
    pending:
        'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/50 dark:text-yellow-300',
    recieved:
        'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-300',
    delivered:
        'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300',
    payment:
        'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300',
};

const formatStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

const formatAmount = (amount: number) => Number(amount).toFixed(2);

export default function CustomerVouchers() {
    const [vouchers, setVouchers] = useState<CustomerVoucher[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderingVoucherId, setOrderingVoucherId] = useState<number | null>(
        null,
    );
    const [checkedProducts, setCheckedProducts] = useState<
        Record<number, boolean>
    >({});
    const [orderQuantities, setOrderQuantities] = useState<
        Record<number, string>
    >({});
    const orderForm = useForm({
        products: [] as { product_id: number; quantity: number }[],
    });

    useEffect(() => {
        fetch('/customer-vouchers-list', {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unable to load your vouchers.');
                }

                return response.json() as Promise<CustomerVoucher[]>;
            })
            .then(setVouchers)
            .catch((fetchError) => {
                setError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : 'Unable to load your vouchers.',
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const startOrdering = (voucher: CustomerVoucher) => {
        setOrderingVoucherId(voucher.id);
        setCheckedProducts(
            Object.fromEntries(
                voucher.products.map((product) => [product.product_id, true]),
            ),
        );
        setOrderQuantities(
            Object.fromEntries(
                voucher.products.map((product) => [
                    product.product_id,
                    String(product.quantity),
                ]),
            ),
        );
        orderForm.clearErrors();
    };

    const submitOrder = (
        event: FormEvent<HTMLFormElement>,
        voucher: CustomerVoucher,
    ) => {
        event.preventDefault();

        const products = voucher.products
            .filter((product) => checkedProducts[product.product_id])
            .map((product) => ({
                product_id: product.product_id,
                quantity: Number(orderQuantities[product.product_id] ?? 0),
            }))
            .filter(
                (product) =>
                    Number.isFinite(product.quantity) && product.quantity > 0,
            );

        orderForm.transform(() => ({ products }));
        orderForm.post(customerVoucherOrder.url(voucher.id), {
            preserveScroll: true,
            onError: (errors) => orderForm.setError(errors),
            onSuccess: () => {
                setOrderingVoucherId(null);
                setVouchers((current) =>
                    current.map((currentVoucher) =>
                        currentVoucher.id === voucher.id
                            ? { ...currentVoucher, status: 'pending' }
                            : currentVoucher,
                    ),
                );
            },
        });
    };

    const filteredVouchers = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) {
            return vouchers;
        }

        return vouchers.filter((voucher) =>
            [
                voucher.service_no,
                voucher.name,
                voucher.phone,
                voucher.personnel_type,
                voucher.category,
                voucher.for_month,
                voucher.status,
            ].some((value) => value?.toLowerCase().includes(normalizedSearch)),
        );
    }, [searchTerm, vouchers]);

    return (
        <>
            <Head title="My Vouchers" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            FreshMart
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            My Vouchers
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            View your purchased ration vouchers and payment
                            details.
                        </p>
                    </div>
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="search"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Search vouchers..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="flex items-center justify-center rounded-2xl border border-dashed border-green-200 px-6 py-16 text-gray-500 dark:border-green-900 dark:text-gray-400">
                        <LoaderCircle className="mr-2 size-5 animate-spin" />
                        Loading your vouchers...
                    </div>
                ) : filteredVouchers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-green-200 px-6 py-16 text-center dark:border-green-900">
                        <Ticket className="mx-auto size-10 text-green-500" />
                        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {searchTerm
                                ? 'No vouchers match your search.'
                                : 'No purchased vouchers yet.'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Your purchased vouchers will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredVouchers.map((voucher) => (
                            <Card
                                key={voucher.id}
                                className="overflow-hidden border-green-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-green-900"
                            >
                                <CardHeader className="gap-3 bg-green-50/70 dark:bg-green-950/20">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-green-600 p-2 text-white">
                                                <Ticket className="size-5" />
                                            </div>
                                            <div>
                                                <CardTitle>
                                                    {voucher.category} Voucher
                                                </CardTitle>
                                                <CardDescription>
                                                    #{voucher.id} ·{' '}
                                                    {voucher.service_no}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                statusStyles[voucher.status] ??
                                                'border-gray-200 bg-gray-50 text-gray-700'
                                            }
                                        >
                                            {formatStatus(voucher.status)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-5 pt-6">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-start gap-2">
                                            <CalendarDays className="mt-0.5 size-4 text-green-600" />
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    For month
                                                </p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {voucher.for_month ?? '—'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <UserRound className="mt-0.5 size-4 text-green-600" />
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Personnel
                                                </p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {voucher.personnel_type}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/70">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Voucher price
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {formatAmount(
                                                    voucher.total_price,
                                                )}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Raising cost
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {formatAmount(
                                                    voucher.raising_cost,
                                                )}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                                            <span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100">
                                                <CircleDollarSign className="size-4 text-green-600" />{' '}
                                                Total payment Back
                                            </span>
                                            <span className="text-lg font-bold text-green-700 dark:text-green-400">
                                                {formatAmount(
                                                    voucher.total_payment,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {voucher.status === 'recieved' &&
                                    orderingVoucherId !== voucher.id ? (
                                        <Button
                                            type="button"
                                            onClick={() => startOrdering(voucher)}
                                            className="w-full bg-green-600 text-white hover:bg-green-700"
                                        >
                                            Order Now
                                        </Button>
                                    ) : null}
                                    {orderingVoucherId === voucher.id ? (
                                        <Dialog
                                            open={orderingVoucherId === voucher.id}
                                            onOpenChange={(open) => {
                                                if (!open) {
                                                    setOrderingVoucherId(null);
                                                }
                                            }}
                                        >
                                            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Order voucher products
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Select products and enter
                                                        the quantity you want to
                                                        order.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form
                                                    onSubmit={(event) =>
                                                        submitOrder(event, voucher)
                                                    }
                                                    className="flex flex-col gap-4"
                                                >
                                            <div className="grid gap-3 md:hidden">
                                                {voucher.products.map((product) => {
                                                    const quantity = Number(
                                                        orderQuantities[product.product_id] ?? 0,
                                                    );
                                                    const selected = Boolean(
                                                        checkedProducts[product.product_id],
                                                    );

                                                    return (
                                                        <div
                                                            key={product.product_id}
                                                            className={`rounded-xl border p-4 shadow-sm transition ${
                                                                selected
                                                                    ? 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                                                                    : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div>
                                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                                        {product.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Unit: {product.unit}
                                                                    </p>
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selected}
                                                                    onChange={(event) =>
                                                                        setCheckedProducts(
                                                                            (current) => ({
                                                                                ...current,
                                                                                [product.product_id]:
                                                                                    event.target.checked,
                                                                            }),
                                                                        )
                                                                    }
                                                                    className="mt-1 size-5 accent-green-600"
                                                                    aria-label={`Order ${product.name}`}
                                                                />
                                                            </div>
                                                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                                <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Original quantity
                                                                    </p>
                                                                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                                                                        {product.quantity.toFixed(3)}
                                                                    </p>
                                                                </div>
                                                                <label className="rounded-lg bg-white p-3 dark:bg-gray-900">
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Order quantity
                                                                    </span>
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        max={product.quantity}
                                                                        step="0.001"
                                                                        value={
                                                                            orderQuantities[
                                                                                product.product_id
                                                                            ] ?? ''
                                                                        }
                                                                        onChange={(event) =>
                                                                            setOrderQuantities(
                                                                                (current) => ({
                                                                                    ...current,
                                                                                    [product.product_id]:
                                                                                        event.target.value,
                                                                                }),
                                                                            )
                                                                        }
                                                                        disabled={!selected}
                                                                        className="mt-1 h-8 text-right"
                                                                        aria-label={`Order quantity for ${product.name}`}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 text-sm dark:border-gray-700">
                                                                <span className="text-gray-500 dark:text-gray-400">
                                                                    {formatAmount(product.unit_price)} ×{' '}
                                                                    {selected ? quantity.toFixed(3) : '0.000'}
                                                                </span>
                                                                <span className="font-bold text-green-700 dark:text-green-400">
                                                                    {formatAmount(
                                                                        selected
                                                                            ? product.unit_price * quantity
                                                                            : 0,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="hidden overflow-x-auto md:block">
                                                <table className="min-w-full text-left text-sm">
                                                    <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                                                        <tr>
                                                            <th className="px-2 py-2">
                                                                Select
                                                            </th>
                                                            <th className="px-2 py-2">
                                                                Product
                                                            </th>
                                                            <th className="px-2 py-2 text-right">
                                                                Original qty
                                                            </th>
                                                            <th className="px-2 py-2 text-right">
                                                                Order qty
                                                            </th>
                                                            <th className="px-2 py-2 text-right">
                                                                Unit price
                                                            </th>
                                                            <th className="px-2 py-2 text-right">
                                                                Order total
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {voucher.products.map(
                                                            (product) => {
                                                                const quantity =
                                                                    Number(
                                                                        orderQuantities[
                                                                            product
                                                                                .product_id
                                                                        ] ?? 0,
                                                                    );
                                                                const selected =
                                                                    Boolean(
                                                                        checkedProducts[
                                                                            product
                                                                                .product_id
                                                                        ],
                                                                    );

                                                                return (
                                                                    <tr
                                                                        key={
                                                                            product.product_id
                                                                        }
                                                                        className="border-b border-gray-100 dark:border-gray-800"
                                                                    >
                                                                        <td className="px-2 py-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    selected
                                                                                }
                                                                                onChange={(
                                                                                    event,
                                                                                ) => {
                                                                                    setCheckedProducts(
                                                                                        (
                                                                                            current,
                                                                                        ) => ({
                                                                                            ...current,
                                                                                            [product.product_id]:
                                                                                                event
                                                                                                    .target
                                                                                                    .checked,
                                                                                        }),
                                                                                    );
                                                                                }}
                                                                                className="size-4 accent-green-600"
                                                                                aria-label={`Order ${product.name}`}
                                                                            />
                                                                        </td>
                                                                        <td className="px-2 py-2 font-medium text-gray-900 dark:text-gray-100">
                                                                            {product.name}{' '}
                                                                            <span className="text-gray-500">
                                                                                ({product.unit})
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-2 py-2 text-right">
                                                                            {product.quantity.toFixed(
                                                                                3,
                                                                            )}
                                                                        </td>
                                                                        <td className="px-2 py-2">
                                                                            <Input
                                                                                type="number"
                                                                                min="0"
                                                                                max={
                                                                                    product.quantity
                                                                                }
                                                                                step="0.001"
                                                                                value={
                                                                                    orderQuantities[
                                                                                        product
                                                                                            .product_id
                                                                                    ] ??
                                                                                    ''
                                                                                }
                                                                                onChange={(
                                                                                    event,
                                                                                ) =>
                                                                                    setOrderQuantities(
                                                                                        (
                                                                                            current,
                                                                                        ) => ({
                                                                                            ...current,
                                                                                            [product.product_id]:
                                                                                                event
                                                                                                    .target
                                                                                                    .value,
                                                                                        }),
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    !selected
                                                                                }
                                                                                className="w-24 text-right"
                                                                                aria-label={`Order quantity for ${product.name}`}
                                                                            />
                                                                        </td>
                                                                        <td className="px-2 py-2 text-right">
                                                                            {formatAmount(
                                                                                product.unit_price,
                                                                            )}
                                                                        </td>
                                                                        <td className="px-2 py-2 text-right font-medium">
                                                                            {formatAmount(
                                                                                selected
                                                                                    ? product.unit_price *
                                                                                          quantity
                                                                                    : 0,
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            },
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {(() => {
                                                const orderGrandTotal =
                                                    voucher.products.reduce(
                                                        (total, product) =>
                                                            total +
                                                            (checkedProducts[
                                                                product.product_id
                                                            ]
                                                                ? product.unit_price *
                                                                  Number(
                                                                      orderQuantities[
                                                                          product
                                                                              .product_id
                                                                      ] ?? 0,
                                                                  )
                                                                : 0),
                                                        0,
                                                    );

                                                return (
                                                    <div className="flex flex-col gap-2 border-t border-gray-200 pt-3 text-sm dark:border-gray-700">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                                Order grand
                                                                total
                                                            </span>
                                                            <span className="text-lg font-bold text-green-700 dark:text-green-400">
                                                                {formatAmount(
                                                                    orderGrandTotal,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                                Total payment
                                                            </span>
                                                            <span className="font-bold text-gray-900 dark:text-gray-100">
                                                                {formatAmount(
                                                                    Math.max(
                                                                        0,
                                                                        voucher.total_price -
                                                                            voucher.raising_cost -
                                                                            orderGrandTotal,
                                                                    ),
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                            <InputError
                                                message={orderForm.errors.products}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    type="submit"
                                                    disabled={orderForm.processing}
                                                    className="bg-green-600 text-white hover:bg-green-700"
                                                >
                                                    {orderForm.processing
                                                        ? 'Submitting...'
                                                        : 'Submit Order'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setOrderingVoucherId(
                                                            null,
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                                </form>
                                                <DialogFooter />
                                            </DialogContent>
                                        </Dialog>
                                    ) : null}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
