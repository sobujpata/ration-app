import { Form, Head, Link, router } from '@inertiajs/react';
import { Banknote, Plus, Search, ShoppingCart, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as salesIndex, show as salesShow, store as salesStore } from '@/routes/sales';

type Product = {
    id: number;
    name: string;
    unit: string;
    quantity: number;
    sku: string | null;
    sale_unit_price: number;
};

type Customer = { id: number; name: string };

type Invoice = {
    id: number;
    customer_name: string;
    grand_total: number;
    paid_amount: number;
    due_amount: number;
    status: string;
    created_at: string | null;
};

type InvoicePage = {
    data: Invoice[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type CartItem = Product & { saleQuantity: number; price: number };

const money = (value: number) => value.toFixed(2);

export default function Index({
    products,
    customers,
    invoices,
    invoiceSearch,
}: {
    products: Product[];
    customers: Customer[];
    invoices: InvoicePage;
    invoiceSearch: string;
}) {
    const [mode, setMode] = useState<'pos' | 'manual'>('pos');
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerId, setCustomerId] = useState('');
    const [paidAmount, setPaidAmount] = useState('0');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [manualQuantity, setManualQuantity] = useState('1');
    const [manualPrice, setManualPrice] = useState('0');
    const [invoiceSearchTerm, setInvoiceSearchTerm] = useState(invoiceSearch);

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        return products.filter((product) => {
            if (!term) {
                return true;
            }

            return `${product.name} ${product.sku ?? ''}`.toLowerCase().includes(term);
        });
    }, [products, search]);

    const grandTotal = useMemo(
        () => cart.reduce((total, item) => total + item.saleQuantity * item.price, 0),
        [cart],
    );
    const paid = Math.min(Math.max(Number(paidAmount) || 0, 0), grandTotal);
    const due = Math.max(0, grandTotal - paid);

    const changeMode = (nextMode: 'pos' | 'manual') => {
        setMode(nextMode);

        if (nextMode === 'pos') {
            setCart((current) => current.map((item) => ({ ...item, price: item.sale_unit_price })));
        }
    };

    const selectProduct = (product: Product) => {
        if (mode === 'pos') {
            addProduct(product);

            return;
        }

        setSelectedProduct(product);
        setManualQuantity('1');
        setManualPrice(String(product.sale_unit_price));
    };

    const addProduct = (product: Product) => {
        setCart((current) => {
            const existing = current.find((item) => item.id === product.id);

            if (existing) {
                return current.map((item) => item.id === product.id
                    ? { ...item, saleQuantity: Math.min(item.saleQuantity + 1, product.quantity) }
                    : item);
            }

            return [...current, { ...product, saleQuantity: 1, price: product.sale_unit_price }];
        });
    };

    const addManualProduct = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedProduct) {
            return;
        }

        const quantity = Math.max(1, Math.min(Number(manualQuantity) || 1, selectedProduct.quantity));
        const price = Math.max(0, Number(manualPrice) || 0);

        setCart((current) => {
            const existing = current.find((item) => item.id === selectedProduct.id);

            if (existing) {
                return current.map((item) => item.id === selectedProduct.id
                    ? { ...item, saleQuantity: Math.min(quantity, selectedProduct.quantity), price }
                    : item);
            }

            return [...current, { ...selectedProduct, saleQuantity: quantity, price }];
        });
        setSelectedProduct(null);
    };

    const updateQuantity = (id: number, quantity: number) => {
        setCart((current) => current.map((item) => item.id === id
            ? { ...item, saleQuantity: Math.max(1, Math.min(quantity || 1, item.quantity)) }
            : item));
    };

    const updatePrice = (id: number, price: number) => {
        setCart((current) => current.map((item) => item.id === id
            ? { ...item, price: Math.max(0, price) }
            : item));
    };

    const removeProduct = (id: number) => {
        setCart((current) => current.filter((item) => item.id !== id));
    };

    const searchInvoices = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(salesIndex({ query: { search: invoiceSearchTerm } }).url, {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <>
            <Head title="Sales" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-sky-950 dark:bg-black">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Sales</p>
                    <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Point of sale</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create a product sale or enter a manual price before saving the invoice.</p>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-950 dark:bg-black">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Products</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Select products to add them to the sale.</p>
                            </div>
                            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
                                <button type="button" onClick={() => changeMode('pos')} className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === 'pos' ? 'bg-white text-indigo-700 shadow-sm dark:bg-black dark:text-indigo-300' : 'text-slate-500'}`}>POS price</button>
                                <button type="button" onClick={() => changeMode('manual')} className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === 'manual' ? 'bg-white text-indigo-700 shadow-sm dark:bg-black dark:text-indigo-300' : 'text-slate-500'}`}>Manual price</button>
                            </div>
                        </div>

                        <div className="relative mt-5">
                            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
                            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product or SKU..." className="pl-9" />
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <button key={product.id} type="button" disabled={product.quantity < 1} onClick={() => selectProduct(product)} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-400 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:hover:bg-indigo-950/30">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="font-medium text-slate-900 dark:text-slate-100">{product.name}</span>
                                        <Plus className="size-4 shrink-0 text-indigo-600" />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">{product.sku || 'No SKU'} · Stock {product.quantity} {product.unit}</p>
                                    <p className="mt-3 font-semibold text-indigo-700 dark:text-indigo-300">{money(product.sale_unit_price)}</p>
                                </button>
                            ))}
                            {filteredProducts.length === 0 && <p className="col-span-full py-8 text-center text-sm text-slate-500">No products found.</p>}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-sky-950 dark:bg-black">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><ShoppingCart className="size-5" /></div>
                            <div><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Current sale</h2><p className="text-sm text-slate-500">{cart.length} product{cart.length === 1 ? '' : 's'}</p></div>
                        </div>

                        <Form
                            {...salesStore.form()}
                            className="mt-5 space-y-5"
                            onSuccess={() => {
                                setCart([]);
                                setCustomerId('');
                                setPaidAmount('0');
                                setSearch('');
                            }}
                        >
                            {({ errors, processing }) => (
                                <>
                                    <input type="hidden" name="mode" value={mode} />
                                    <input
                                        type="hidden"
                                        name="products_payload"
                                        value={JSON.stringify(cart.map((item) => ({
                                            product_id: item.id,
                                            quantity: item.saleQuantity,
                                            price: item.price,
                                        })))}
                                    />
                                    {cart.map((item, index) => (
                                        <div key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                                            <div className="flex items-start justify-between gap-3">
                                                <div><p className="font-medium text-slate-900 dark:text-slate-100">{item.name}</p><p className="text-xs text-slate-500">{item.unit} · max {item.quantity}</p></div>
                                                <button type="button" onClick={() => removeProduct(item.id)} className="text-slate-400 transition hover:text-red-600" aria-label={`Remove ${item.name}`}><Trash2 className="size-4" /></button>
                                            </div>
                                            <input type="hidden" name={`products[${index}][product_id]`} value={item.id} />
                                            <div className="mt-3 grid grid-cols-2 gap-3">
                                                <div className="space-y-1"><Label htmlFor={`quantity-${item.id}`} className="text-xs">Quantity</Label><Input id={`quantity-${item.id}`} name={`products[${index}][quantity]`} type="number" min="1" max={item.quantity} value={item.saleQuantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} /></div>
                                                <div className="space-y-1"><Label htmlFor={`price-${item.id}`} className="text-xs">Unit price</Label><Input id={`price-${item.id}`} name={`products[${index}][price]`} type="number" min="0" step="0.01" value={item.price} onChange={(event) => updatePrice(item.id, Number(event.target.value))} readOnly={mode === 'pos'} /></div>
                                            </div>
                                            <p className="mt-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">{money(item.saleQuantity * item.price)}</p>
                                        </div>
                                    ))}
                                    <InputError message={errors.products} />

                                    <div className="space-y-2">
                                        <Label htmlFor="customer_id">Customer (optional)</Label>
                                        <select id="customer_id" name="customer_id" value={customerId} onChange={(event) => setCustomerId(event.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-black">
                                            <option value="">Walk-in customer</option>
                                            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
                                        </select>
                                        <InputError message={errors.customer_id} />
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="paid_amount">Paid amount</Label><Input id="paid_amount" name="paid_amount" type="number" min="0" step="0.01" value={paidAmount} onChange={(event) => setPaidAmount(event.target.value)} placeholder={money(grandTotal)} required /><InputError message={errors.paid_amount} /></div>

                                    <div className="space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
                                        <div className="flex justify-between text-slate-500"><span>Grand total</span><span>{money(grandTotal)}</span></div>
                                        <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-100"><span>Paid</span><span>{money(paid)}</span></div>
                                        <div className="flex justify-between font-semibold text-amber-700 dark:text-amber-300"><span>Due</span><span>{money(due)}</span></div>
                                    </div>
                                    <Button type="submit" disabled={processing || cart.length === 0} className="w-full gap-2 bg-indigo-600 text-white hover:bg-indigo-700"><Banknote className="size-4" />{processing ? 'Saving invoice...' : 'Save sale'}</Button>
                                </>
                            )}
                        </Form>
                    </section>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-sky-950 dark:bg-black">
                    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Invoices</h2>
                        <form onSubmit={searchInvoices} className="flex gap-2">
                            <Input value={invoiceSearchTerm} onChange={(event) => setInvoiceSearchTerm(event.target.value)} placeholder="Search invoice or customer..." className="w-64" />
                            <Button type="submit" variant="outline">Search</Button>
                        </form>
                    </div>
                    <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 dark:bg-slate-950"><tr><th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Paid</th><th className="px-5 py-3">Due</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3">Action</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{invoices.data.map((invoice) => <tr key={invoice.id}><td className="px-5 py-3 font-medium">#{invoice.id}</td><td className="px-5 py-3">{invoice.customer_name}</td><td className="px-5 py-3">{money(invoice.grand_total)}</td><td className="px-5 py-3">{money(invoice.paid_amount)}</td><td className="px-5 py-3">{money(invoice.due_amount)}</td><td className="px-5 py-3 capitalize">{invoice.status}</td><td className="px-5 py-3 text-slate-500">{invoice.created_at ?? '—'}</td><td className="px-5 py-3"><Link href={salesShow(invoice.id).url} className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">View</Link></td></tr>)}{invoices.data.length === 0 && <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-500">No sales recorded yet.</td></tr>}</tbody></table></div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-sm dark:border-slate-800">
                        <span className="text-slate-500">Showing {invoices.from ?? 0}–{invoices.to ?? 0} of {invoices.total}</span>
                        <div className="flex gap-1">{invoices.links.map((link, index) => link.url ? <Link key={`${link.label}-${index}`} href={link.url} preserveScroll className={`rounded-md px-3 py-1.5 ${link.active ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'}`} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={`${link.label}-${index}`} className="px-3 py-1.5 text-slate-400" dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>
                    </div>
                </section>
            </div>
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="manual-product-title">
                    <form onSubmit={addManualProduct} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-black">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">Manual sale item</p>
                                <h2 id="manual-product-title" className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{selectedProduct.name}</h2>
                                <p className="mt-1 text-sm text-slate-500">Available stock: {selectedProduct.quantity} {selectedProduct.unit}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedProduct(null)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900" aria-label="Close product dialog"><X className="size-5" /></button>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="manual-quantity">Quantity</Label>
                                <Input id="manual-quantity" type="number" min="1" max={selectedProduct.quantity} step="1" value={manualQuantity} onChange={(event) => setManualQuantity(event.target.value)} required autoFocus />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="manual-price">Unit price</Label>
                                <Input id="manual-price" type="number" min="0" step="0.01" value={manualPrice} onChange={(event) => setManualPrice(event.target.value)} required />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setSelectedProduct(null)}>Cancel</Button>
                            <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Add product</Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Sales', href: '/sales' }] };
