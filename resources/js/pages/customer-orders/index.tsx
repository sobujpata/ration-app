import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    CreditCard,
    PackageCheck,
    PackageOpen,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type OrderProduct = {
    name: string;
    unit: string;
    quantity: number;
    unit_price: number;
    total_price: number;
};

type CustomerOrder = {
    id: number;
    category: string;
    for_month: string | null;
    status: string;
    updated_at: string | null;
    total_price: number;
    raising_cost: number;
    total_payment: number;
    products: OrderProduct[];
};

const formatAmount = (amount: number) => Number(amount).toFixed(2);

const statusStyles: Record<string, string> = {
    pending:
        'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-300',
    processed:
        'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
    recieved:
        'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300',
    delivered:
        'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300',
    complete:
        'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300',
};

const formatStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

const statusSteps = [
    { key: 'processed', label: 'Processed' },
    { key: 'out-for-delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'payment', label: 'Payment Done' },
    { key: 'complete', label: 'Complete' },
];

const statusLabels: Record<string, string> = {
    processed: 'Processed',
    pending: 'Out for Delivery',
    recieved: 'Processed',
    delivered: 'Delivered',
    payment: 'Payment Done',
    complete: 'Complete',
};

const statusIndexes: Record<string, number> = {
    pending: 0,
    recieved: 0,
    processed: 1,
    delivered: 2,
    payment: 3,
    complete: 4,
};

function StatusTimeline({ status }: { status: string }) {
    const currentStep = statusIndexes[status] ?? 0;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                        Order progress
                    </p>
                    <p className="mt-1 text-base font-bold text-gray-900 dark:text-gray-100">
                        {statusLabels[status] ?? formatStatus(status)}
                    </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-950/70 dark:text-green-300">
                    Step {currentStep + 1} of {statusSteps.length}
                </span>
            </div>

            <div className="relative mt-6 pb-1">
                <div className="flex min-w-0 flex-col items-center gap-2 md:min-w-[640px] md:flex-row md:flex-nowrap md:items-center md:gap-3">
                    {statusSteps.map((step, index) => {
                        const isComplete = currentStep >= index;
                        const Icon =
                            index === 0
                                ? Clock3
                                : index === 1
                                  ? Truck
                                  : index === 2
                                    ? PackageCheck
                                    : index === 3
                                      ? CreditCard
                                      : CheckCircle2;

                        return (
                            <div
                                key={step.key}
                                className="flex w-full shrink-0 flex-col items-center gap-2 md:w-auto md:flex-row md:gap-3"
                            >
                                <div
                                    className={`flex size-10 items-center justify-center rounded-full border-4 border-white shadow-md transition-all dark:border-gray-900 ${
                                        isComplete
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                                    }`}
                                >
                                    {isComplete ? (
                                        <CheckCircle2 className="size-5" />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                </div>
                                <span
                                    className={`whitespace-nowrap text-xs font-semibold ${
                                        isComplete
                                            ? 'text-green-700 dark:text-green-400'
                                            : 'text-gray-400 dark:text-gray-500'
                                    }`}
                                >
                                    {step.label}
                                </span>
                                {index < statusSteps.length - 1 ? (
                                    <span
                                        className={`h-6 w-1 shrink-0 rounded-full md:h-1 md:w-8 lg:w-12 ${
                                            currentStep > index
                                                ? 'bg-gradient-to-b from-green-500 to-emerald-400 md:bg-gradient-to-r'
                                                : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                    />
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function CustomerOrders({
    orders,
}: {
    orders: CustomerOrder[];
}) {
    return (
        <>
            <Head title="Order Monitoring" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        FreshMart
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Order Monitoring
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Track the progress and products of your submitted
                        voucher orders.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-green-200 px-6 py-16 text-center dark:border-green-900">
                        <ShoppingBag className="mx-auto size-10 text-green-500" />
                        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            No orders submitted yet
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Orders submitted from My Vouchers will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-1">
                        {orders.map((order) => {
                            const deliveryProductsTotal = order.products.reduce(
                                (total, product) => total + product.total_price,
                                0,
                            );

                            return (
                                <Card
                                key={order.id}
                                className="overflow-hidden border-gray-200 dark:bg-gray-900 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800"
                            >
                                <CardHeader className="gap-5 dark:bg-gray-900 bg-white">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-xl">
                                                {order.category} Order
                                            </CardTitle>
                                            <CardDescription>
                                                Voucher #{order.id} ·{' '}
                                                {order.for_month ?? '—'}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            className={
                                                statusStyles[order.status] ??
                                                'border-gray-200 bg-gray-50 text-gray-700'
                                            }
                                        >
                                            {statusLabels[order.status] ??
                                                formatStatus(order.status)}
                                        </Badge>
                                    </div>
                                    <StatusTimeline status={order.status} />
                                </CardHeader>
                                <CardContent className="flex flex-col gap-5 pt-6">
                                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {order.products.map((product) => (
                                            <div
                                                key={`${order.id}-${product.name}`}
                                                className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800 dark:shadow-inner dark:shadow-black/10"
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
                                                    <p className="font-bold text-green-700 dark:text-green-400">
                                                        {formatAmount(
                                                            product.total_price,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="mt-3 flex justify-between text-sm text-gray-600 dark:text-slate-300">
                                                    <span>
                                                        Quantity:{' '}
                                                        {product.quantity.toFixed(
                                                            3,
                                                        )}
                                                    </span>
                                                    <span>
                                                        Unit price:{' '}
                                                        {formatAmount(
                                                            product.unit_price,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800 dark:shadow-inner dark:shadow-black/10">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-slate-300">
                                                Voucher total
                                            </span>
                                            <span className="font-medium">
                                                {formatAmount(order.total_price)}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-slate-300">
                                                Raising cost
                                            </span>
                                            <span className="font-medium">
                                                {formatAmount(order.raising_cost)}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-slate-300">
                                                Total Received Products
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {formatAmount(
                                                    deliveryProductsTotal,
                                                )}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 dark:border-slate-700">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                Total Payment Back
                                            </span>
                                            <span className="font-bold text-green-700 dark:text-green-400">
                                                {formatAmount(order.total_payment)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Last updated: {order.updated_at ?? '—'}
                                    </p>
                                </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

CustomerOrders.layout = {
    breadcrumbs: [{ title: 'Order Monitoring', href: '/customer-orders' }],
};
