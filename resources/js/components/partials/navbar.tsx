import { Link, usePage } from '@inertiajs/react';
import { dashboard, home, login, logout, register } from '@/routes';
import { ShoppingBasket, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type SharedProps = {
    auth?: {
        user?: {
            name?: string;
        } | null;
    };
};

export default function Navbar() {
    const { auth } = usePage<SharedProps>().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-green-200/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-green-900/50 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:dark:bg-gray-900/60">
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <Link href={home()} className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    <div className="bg-green-600 rounded-lg p-2">
                        <ShoppingBasket className="h-6 w-6 text-white" />
                    </div>
                    <span>FreshMart</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2 text-sm">
                    {user ? (
                        <>
                            <span className="text-gray-600 dark:text-gray-400">
                                Welcome, {user.name}
                            </span>
                            <Link
                                href="/profile"
                                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md px-4 py-2 transition-colors font-medium"
                            >
                                Profile
                            </Link>
                            <Link
                                href={dashboard()}
                                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md px-4 py-2 transition-colors font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={logout()}
                                method="post"
                                as="button"
                                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md px-4 py-2 transition-colors font-medium"
                            >
                                Log out
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md px-4 py-2 transition-colors font-medium"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-5 py-2 transition-colors font-medium shadow-sm"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-green-200/50 dark:border-green-900/50 bg-white dark:bg-gray-900 px-4 py-4">
                    <div className="flex flex-col gap-2 text-sm">
                        {user ? (
                            <>
                                <span className="text-gray-600 dark:text-gray-400 px-4 py-2">
                                    Welcome, {user.name}
                                </span>
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md px-4 py-2 transition-colors font-medium"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href={dashboard()}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md px-4 py-2 transition-colors font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={logout()}
                                    method="post"
                                    as="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md px-4 py-2 transition-colors font-medium text-left"
                                >
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md px-4 py-2 transition-colors font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 transition-colors font-medium shadow-sm text-center"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
