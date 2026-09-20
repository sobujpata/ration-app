import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Create() {
    return (
        <>
            <Head title="Personnel type create" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-2xl p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-sky-950 dark:bg-black">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-200">Administration</p>
                    <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Add new personnel type</h1>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-sky-950 dark:bg-black">
                    <Form action="/personnel-types" method="post" className="space-y-6">
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" type="text" name="name" placeholder="Enter personnel type name" required />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            defaultValue="1"
                                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-sky-950 focus:outline-none dark:border-sky-950 dark:bg-black dark:text-slate-100"
                                            required
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" type="text" name="description" placeholder="Enter description" />
                                        <InputError message={errors.description} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing} className="min-w-40 bg-green-600 text-white hover:bg-green-700">
                                        {processing ? 'Saving...' : 'Create personnel type'}
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
            title: 'Personnel types',
            href: '/personnel-types',
        },
        {
            title: 'Create',
            href: '/personnel-types/create',
        },
    ],
};
