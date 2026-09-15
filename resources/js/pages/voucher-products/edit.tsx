import { Form, Head } from '@inertiajs/react';
import { Check, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PersonnelType = { id: number; name: string };
type VoucherCategory = { id: number; name: string };
type Product = { id: number; name: string; unit: string; purchase_unit_price: string | number };
type VoucherLine = { product_id: number; quantity: string | number; status: boolean };
type Voucher = { id: number; personnel_type_id: number; category_id: number; products: VoucherLine[] };

type EditProps = {
    voucher: Voucher;
    personnel_types: PersonnelType[];
    voucher_categories: VoucherCategory[];
    products: Product[];
};

export default function Edit({ voucher, personnel_types, voucher_categories, products }: EditProps) {
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>(() => voucher.products.map((product) => product.product_id));
    const [quantities, setQuantities] = useState<Record<number, string>>(() => Object.fromEntries(voucher.products.map((product) => [product.product_id, String(product.quantity)])));
    const [statuses, setStatuses] = useState<Record<number, boolean>>(() => Object.fromEntries(voucher.products.map((product) => [product.product_id, product.status])));
    const selectedProducts = useMemo(() => products.filter((product) => selectedProductIds.includes(product.id)), [products, selectedProductIds]);
    const calculation = useMemo(() => selectedProducts.reduce(
        (total, product) => {
            if (!(statuses[product.id] ?? true)) {
                return total;
            }

            return {
                productCount: total.productCount + 1,
                totalPrice: total.totalPrice + Number(product.purchase_unit_price) * Number(quantities[product.id] || 0),
            };
        },
        { productCount: 0, totalPrice: 0 },
    ), [quantities, selectedProducts, statuses]);

    const toggleProduct = (productId: number) => {
        setSelectedProductIds((currentIds) => currentIds.includes(productId)
            ? currentIds.filter((id) => id !== productId)
            : [...currentIds, productId]);
    };

    return (
        <>
            <Head title={`Edit voucher #${voucher.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-sky-950 dark:bg-black">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><Pencil className="size-6" /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Voucher #{voucher.id}</p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Edit voucher</h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update its details, products, quantities, and line status.</p>
                        </div>
                    </div>
                </div>

                <Form action={`/vouchers/${voucher.id}`} method="put" className="space-y-6">
                    {({ errors, processing }) => (
                        <>
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-950 dark:bg-black">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div><h2 className="font-semibold text-slate-900 dark:text-slate-100">Voucher details</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">These details apply to every selected product.</p></div>
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected</span>
                                </div>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="personnel_type_id">Personnel type</Label>
                                        <select id="personnel_type_id" name="personnel_type_id" defaultValue={voucher.personnel_type_id} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black dark:text-slate-100" required>
                                            {personnel_types.map((personnelType) => <option key={personnelType.id} value={personnelType.id}>{personnelType.name}</option>)}
                                        </select>
                                        <InputError message={errors.personnel_type_id} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">Voucher category</Label>
                                        <select id="category_id" name="category_id" defaultValue={voucher.category_id} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-black dark:text-slate-100" required>
                                            {voucher_categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                        </select>
                                        <InputError message={errors.category_id} />
                                    </div>
                                </div>
                            </section>

                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-sky-950 dark:bg-black">
                                <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 dark:border-sky-950 sm:flex-row sm:items-center sm:justify-between">
                                    <div><h2 className="font-semibold text-slate-900 dark:text-slate-100">Products</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select products and set the quantity and status for each.</p></div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Quantity is required when selected</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300"><tr><th className="w-16 px-5 py-3 font-semibold">Select</th><th className="px-5 py-3 font-semibold">Product</th><th className="px-5 py-3 font-semibold">Unit</th><th className="px-5 py-3 font-semibold">Purchase unit price</th><th className="w-44 px-5 py-3 font-semibold">Voucher quantity</th><th className="px-5 py-3 font-semibold">Final price</th><th className="w-28 px-5 py-3 font-semibold">Status</th></tr></thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-sky-950">
                                            {products.map((product) => {
                                                const isSelected = selectedProductIds.includes(product.id);
                                                const formIndex = selectedProducts.findIndex((selectedProduct) => selectedProduct.id === product.id);
                                                const isActive = statuses[product.id] ?? true;
                                                const lineTotal = isActive ? Number(product.purchase_unit_price) * Number(quantities[product.id] || 0) : 0;

                                                return <tr key={product.id} className={isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-950'}>
                                                    <td className="px-5 py-4"><input type="checkbox" checked={isSelected} onChange={() => toggleProduct(product.id)} className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" aria-label={`Select ${product.name}`} />{isSelected && <input type="hidden" name={`products[${formIndex}][product_id]`} value={product.id} />}</td>
                                                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">{product.name}</td>
                                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{product.unit}</td>
                                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{product.purchase_unit_price}</td>
                                                    <td className="px-5 py-4"><Input type="number" name={isSelected ? `products[${formIndex}][quantity]` : undefined} value={quantities[product.id] ?? ''} onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: event.target.value }))} min="0.001" step="0.001" placeholder="0.000" disabled={!isSelected} required={isSelected} className="h-9 min-w-28" /></td>
                                                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">{lineTotal.toFixed(2)}</td>
                                                    <td className="px-5 py-4"><button type="button" onClick={() => setStatuses((current) => ({ ...current, [product.id]: !isActive }))} disabled={!isSelected} className={`rounded-full px-3 py-1 text-xs font-medium transition ${isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300'} disabled:cursor-not-allowed disabled:opacity-50`} aria-pressed={isActive}>{isActive ? 'Active' : 'Inactive'}</button>{isSelected && <input type="hidden" name={`products[${formIndex}][status]`} value={isActive ? '1' : '0'} />}</td>
                                                </tr>;
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex flex-wrap justify-end gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm dark:border-sky-950 dark:bg-slate-950"><span className="text-slate-500 dark:text-slate-400">Active products: <strong className="text-slate-900 dark:text-slate-100">{calculation.productCount}</strong></span><span className="font-semibold text-indigo-700 dark:text-indigo-300">Voucher total: {calculation.totalPrice.toFixed(2)}</span></div>
                                <div className="px-5 pb-4 pt-3"><InputError message={errors.products} /></div>
                            </section>

                            <div className="flex justify-end"><Button type="submit" disabled={processing || selectedProducts.length === 0} className="min-w-40 bg-green-600 text-white hover:bg-green-700"><Check className="size-4" />{processing ? 'Updating voucher...' : 'Update voucher'}</Button></div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Edit.layout = { breadcrumbs: [{ title: 'Vouchers', href: '/vouchers' }, { title: 'Edit voucher', href: '#' }] };
