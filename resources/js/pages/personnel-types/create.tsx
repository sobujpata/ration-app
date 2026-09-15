import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Create() {
    return (
        <>
            <Head title="Product Create" />
            <div className="dark:bg-black flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="dark:bg-black dark:border-sky-950 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <p className="text-sm font-medium dark:text-slate-200 text-slate-500">Product Management</p>
                    <h1 className="mt-1 text-2xl font-semibold dark:text-slate-100 text-slate-900">Add New Product</h1>
                </div>

                <div className="rounded-2xl border dark:border-sky-950 border-slate-200 dark:bg-black bg-white p-6 shadow-sm">
                    <Form action="/ration-voucher-categories" method="post" className="space-y-6">
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Category Name</Label>
                                        <Input id="name" type="text" name="name" placeholder="Enter name" className='focus:outline' required />
                                        <InputError message={errors.name} />
                                    </div>

                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" type="text" name="description" placeholder="Enter purchase unit price" required />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="flex h-10 w-full rounded-md border border-slate-200 dark:bg-black bg-white px-3 py-2 text-sm dark:text-slate-100 text-slate-900 shadow-sm transition focus:border-sky-950 focus:outline-none"
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
                                        {processing ? 'Saving...' : 'Create Department'}
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

Create.layout = {
    breadcrumbs: [
        {
            title: 'Department Create',
            href: '/department-manage',
        },
    ],
};
