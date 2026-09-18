import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    showSystem = true,
    ...props
}: HTMLAttributes<HTMLDivElement> & { showSystem?: boolean }) {
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();
    const activeAppearance = showSystem ? appearance : resolvedAppearance;

    // Whether the current effective mode is dark
    const isDark = activeAppearance === 'dark';

    // Toggle between light and dark. If currently "system",
    // switch to the opposite of the resolved appearance.
    const toggleLightDark = () => {
        if (appearance === 'system') {
            updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
        } else {
            updateAppearance(appearance === 'dark' ? 'light' : 'dark');
        }
    };

    const ToggleIcon = isDark ? Moon : Sun;

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            role="group"
            aria-label="Appearance mode"
            {...props}
        >
            {/* Light/Dark toggle button */}
            <button
                type="button"
                onClick={toggleLightDark}
                aria-pressed={activeAppearance !== 'system'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    activeAppearance !== 'system'
                        ? 'bg-white text-green-700 shadow-sm dark:bg-neutral-700 dark:text-green-300'
                        : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100',
                )}
            >
                <ToggleIcon className="size-4" />
                <span>{isDark ? 'Dark' : 'Light'}</span>
            </button>

            {/* System button */}
            {showSystem && (
                <button
                    type="button"
                    onClick={() => updateAppearance('system')}
                    aria-pressed={activeAppearance === 'system'}
                    title="Use system mode"
                    className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                        activeAppearance === 'system'
                            ? 'bg-white text-green-700 shadow-sm dark:bg-neutral-700 dark:text-green-300'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100',
                    )}
                >
                    <Monitor className="size-4" />
                    <span>System</span>
                </button>
            )}
        </div>
    );
}