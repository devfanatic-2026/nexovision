import { clsx } from 'clsx';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    description?: string;
}

export function Toggle({ enabled, onChange, label, description }: ToggleProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 cursor-pointer" onClick={() => onChange(!enabled)}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 cursor-pointer">
                        {label}
                    </label>
                )}
                {description && (
                    <p className="text-sm text-gray-500 mt-0.5">
                        {description}
                    </p>
                )}
            </div>
            <button
                type="button"
                className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    enabled ? 'bg-primary-500' : 'bg-gray-200'
                )}
                role="switch"
                aria-checked={enabled}
                onClick={() => onChange(!enabled)}
            >
                <span
                    aria-hidden="true"
                    className={clsx(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                />
            </button>
        </div>
    );
}
