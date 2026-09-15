import { Form, Head, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/ProfileController';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Auth } from '@/types/auth';

type CustomerProfile = {
    service_no: string | null;
    cus_add: string | null;
    cus_city: string | null;
    cus_state: string | null;
    cus_postcode: string | null;
    cus_country: string | null;
    cus_phone: string | null;
    cus_fax: string | null;
    ship_name: string | null;
    ship_add: string | null;
    ship_city: string | null;
    ship_state: string | null;
    ship_postcode: string | null;
    ship_country: string | null;
    ship_phone: string | null;
};

type ProfileProps = {
    auth: Auth;
    passwordRules: string;
    cusProfile: CustomerProfile | null;
};

type Section = 'personal' | 'security' | 'account';

const sections: { id: Section; label: string }[] = [
    { id: 'personal', label: 'Personal information' },
    { id: 'security', label: 'Security' },
    { id: 'account', label: 'Account' },
];

export default function Profile() {
    const { auth, passwordRules, cusProfile } = usePage<ProfileProps>().props;
    const [activeSection, setActiveSection] = useState<Section>('personal');
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const value = (field: keyof CustomerProfile): string =>
        cusProfile?.[field] ?? '';

    return (
        <>
            <Head title="Profile" />

            <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Profile settings
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your personal information and account security.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
                    <aside>
                        <div className="mb-6 flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full text-lg font-semibold">
                                {getInitials(auth.user.name)}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-medium">
                                    {auth.user.name}
                                </p>
                                <p className="text-muted-foreground truncate text-sm">
                                    {auth.user.email}
                                </p>
                            </div>
                        </div>

                        <nav
                            className="flex gap-1 overflow-x-auto lg:flex-col"
                            aria-label="Profile sections"
                        >
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveSection(section.id)}
                                    className={`rounded-md px-3 py-2 text-left text-sm whitespace-nowrap transition-colors ${
                                        activeSection === section.id
                                            ? 'bg-muted font-medium'
                                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <div className="max-w-3xl">
                        {activeSection === 'personal' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal information</CardTitle>
                                    <CardDescription>
                                        Empty fields can be completed and saved to your customer profile.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form
                                        {...ProfileController.update.form()}
                                        options={{ preserveScroll: true }}
                                        className="grid gap-6"
                                    >
                                        {({ processing, errors, recentlySuccessful }) => (
                                            <>
                                                <div className="grid gap-6 sm:grid-cols-2">
                                                    <ProfileField
                                                        id="service_no"
                                                        label="Personal No"
                                                        defaultValue={value('service_no')}
                                                        placeholder="Enter personal no"
                                                        error={errors.service_no}
                                                    />
                                                    <ProfileField
                                                        id="name"
                                                        label="Name"
                                                        defaultValue={auth.user.name}
                                                        autoComplete="name"
                                                        error={errors.name}
                                                    />
                                                    <ProfileField
                                                        id="email"
                                                        label="Email address"
                                                        type="email"
                                                        defaultValue={auth.user.email}
                                                        autoComplete="email"
                                                        error={errors.email}
                                                    />
                                                    <ProfileField
                                                        id="cus_phone"
                                                        label="Phone No"
                                                        defaultValue={value('cus_phone')}
                                                        placeholder="Enter phone number"
                                                        error={errors.cus_phone}
                                                    />
                                                    <ProfileField
                                                        id="cus_add"
                                                        label="Present Address"
                                                        defaultValue={value('cus_add')}
                                                        placeholder="Enter present address"
                                                        className="sm:col-span-2"
                                                        error={errors.cus_add}
                                                    />
                                                    <ProfileField
                                                        id="cus_city"
                                                        label="Present City"
                                                        defaultValue={value('cus_city')}
                                                        placeholder="Enter city"
                                                        error={errors.cus_city}
                                                    />
                                                    <ProfileField
                                                        id="cus_state"
                                                        label="State"
                                                        defaultValue={value('cus_state')}
                                                        placeholder="Enter state"
                                                        error={errors.cus_state}
                                                    />
                                                    <ProfileField
                                                        id="cus_postcode"
                                                        label="Post Code"
                                                        defaultValue={value('cus_postcode')}
                                                        placeholder="Enter post code"
                                                        error={errors.cus_postcode}
                                                    />
                                                    <ProfileField
                                                        id="cus_country"
                                                        label="Country"
                                                        defaultValue={value('cus_country')}
                                                        placeholder="Enter country"
                                                        error={errors.cus_country}
                                                    />
                                                    <ProfileField
                                                        id="cus_fax"
                                                        label="Fax"
                                                        defaultValue={value('cus_fax')}
                                                        placeholder="Enter fax number"
                                                        error={errors.cus_fax}
                                                    />
                                                </div>

                                                <div className="border-border border-t pt-6">
                                                    <h2 className="font-medium">Shipping information</h2>
                                                    <p className="text-muted-foreground mt-1 text-sm">
                                                        Add a shipping address if it differs from your present address.
                                                    </p>
                                                </div>

                                                <div className="grid gap-6 sm:grid-cols-2">
                                                    <ProfileField
                                                        id="ship_name"
                                                        label="Shipping Name"
                                                        defaultValue={value('ship_name')}
                                                        placeholder="Enter shipping name"
                                                        error={errors.ship_name}
                                                    />
                                                    <ProfileField
                                                        id="ship_phone"
                                                        label="Shipping Phone"
                                                        defaultValue={value('ship_phone')}
                                                        placeholder="Enter shipping phone"
                                                        error={errors.ship_phone}
                                                    />
                                                    <ProfileField
                                                        id="ship_add"
                                                        label="Shipping Address"
                                                        defaultValue={value('ship_add')}
                                                        placeholder="Enter shipping address"
                                                        className="sm:col-span-2"
                                                        error={errors.ship_add}
                                                    />
                                                    <ProfileField
                                                        id="ship_city"
                                                        label="Shipping City"
                                                        defaultValue={value('ship_city')}
                                                        placeholder="Enter shipping city"
                                                        error={errors.ship_city}
                                                    />
                                                    <ProfileField
                                                        id="ship_state"
                                                        label="Shipping State"
                                                        defaultValue={value('ship_state')}
                                                        placeholder="Enter shipping state"
                                                        error={errors.ship_state}
                                                    />
                                                    <ProfileField
                                                        id="ship_postcode"
                                                        label="Shipping Post Code"
                                                        defaultValue={value('ship_postcode')}
                                                        placeholder="Enter shipping post code"
                                                        error={errors.ship_postcode}
                                                    />
                                                    <ProfileField
                                                        id="ship_country"
                                                        label="Shipping Country"
                                                        defaultValue={value('ship_country')}
                                                        placeholder="Enter shipping country"
                                                        error={errors.ship_country}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <Button type="submit" disabled={processing}>
                                                        {processing ? 'Saving...' : 'Save changes'}
                                                    </Button>
                                                    {recentlySuccessful && (
                                                        <span className="text-muted-foreground text-sm">
                                                            Saved.
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </CardContent>
                            </Card>
                        )}

                        {activeSection === 'security' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Update password</CardTitle>
                                    <CardDescription>
                                        Use a unique password that you do not use elsewhere.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form
                                        {...SecurityController.update.form()}
                                        options={{ preserveScroll: true }}
                                        resetOnError={[
                                            'current_password',
                                            'password',
                                            'password_confirmation',
                                        ]}
                                        resetOnSuccess
                                        onError={(errors) => {
                                            if (errors.current_password) {
                                                currentPasswordInput.current?.focus();
                                            } else if (errors.password) {
                                                passwordInput.current?.focus();
                                            }
                                        }}
                                        className="grid gap-6"
                                    >
                                        {({ processing, errors, recentlySuccessful }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="current_password">Current password</Label>
                                                    <PasswordInput
                                                        id="current_password"
                                                        name="current_password"
                                                        ref={currentPasswordInput}
                                                        autoComplete="current-password"
                                                    />
                                                    <InputError message={errors.current_password} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="password">New password</Label>
                                                    <PasswordInput
                                                        id="password"
                                                        name="password"
                                                        ref={passwordInput}
                                                        autoComplete="new-password"
                                                        passwordrules={passwordRules}
                                                    />
                                                    <InputError message={errors.password} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="password_confirmation">Confirm new password</Label>
                                                    <PasswordInput
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        autoComplete="new-password"
                                                        passwordrules={passwordRules}
                                                    />
                                                    <InputError message={errors.password_confirmation} />
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Button type="submit" disabled={processing}>
                                                        {processing ? 'Updating...' : 'Update password'}
                                                    </Button>
                                                    {recentlySuccessful && (
                                                        <span className="text-muted-foreground text-sm">
                                                            Password updated.
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </CardContent>
                            </Card>
                        )}

                        {activeSection === 'account' && <DeleteUser />}
                    </div>
                </div>
            </div>
        </>
    );
}

function ProfileField({
    id,
    label,
    defaultValue,
    error,
    className,
    ...props
}: {
    id: string;
    label: string;
    defaultValue: string;
    error?: string;
    className?: string;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
}) {
    return (
        <div className={`grid gap-2 ${className ?? ''}`}>
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={id}
                defaultValue={defaultValue}
                required={id === 'name' || id === 'email' || id === 'cus_add' || id === 'cus_phone' || id === 'ship_phone'}
                {...props}
            />
            <InputError message={error} />
        </div>
    );
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}
