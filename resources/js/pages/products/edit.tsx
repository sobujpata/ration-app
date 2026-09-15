import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DataForm = {
    id: number;
    name: string;
    unit: string;
    quantity: string;
    purchase_unit_price: string;
    sale_unit_price?: string | null;
    status: string | number;
};

export default function Edit({ product }: { product: DataForm }) {
    return (
        <>
            <Head title="Product Edit" />
            <div className="dark:bg-black flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border dark:border-sky-950 border-slate-200 dark:bg-black bg-white px-6 py-5 shadow-sm">
                    <p className="text-sm font-medium dark:text-slate-200 text-slate-500">Product Management</p>
                    <h1 className="mt-1 text-2xl font-semibold dark:text-slate-100 text-slate-900">Edit Product</h1>
                </div>

                <div className="rounded-2xl border dark:border-sky-950 border-slate-200 dark:bg-black bg-white p-6 shadow-sm">
                    <Form action={`/products/${product.id}`} method="put" className="space-y-6">
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-5 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" type="text" name="name" defaultValue={product.name} placeholder="Enter product name" required />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="unit">unit</Label>
                                        <Input id="unit" type="text" name="unit" defaultValue={product.unit} placeholder="Enter unit" required />
                                        <InputError message={errors.unit} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input id="quantity" type="number" name="quantity" min="0" step="0.001" defaultValue={product.quantity} placeholder="Enter available quantity" required />
                                        <InputError message={errors.quantity} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="purchase_unit_price">Purchase unit price</Label>
                                        <Input id="purchase_unit_price" type="text" name="purchase_unit_price" defaultValue={product.purchase_unit_price} placeholder="Enter purchase unit price" required />
                                        <InputError message={errors.purchase_unit_price} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sale_unit_price">Purchase unit price</Label>
                                        <Input id="sale_unit_price" type="text" name="sale_unit_price" defaultValue={product.sale_unit_price ?? ''} placeholder="Enter purchase unit price" required />
                                        <InputError message={errors.sale_unit_price} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="flex h-10 w-full rounded-md border dark:border-sky-950 border-slate-200 dark:bg-black bg-white px-3 py-2 text-sm dark:text-slate-100 text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none"
                                            defaultValue={product.status}
                                            required
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>
                                </div>

                                

                               

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={processing} className="min-w-40 bg-green-600 text-white hover:bg-green-700">
                                        {processing ? 'Saving...' : 'Update product'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'product Edit',
            href: '/product-manage',
        },
    ],
};
