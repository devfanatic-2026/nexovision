import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    description?: string;
}

export function Toggle({ enabled, onChange, label, description }: ToggleProps) {
    return (
        <Switch.Group>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    {label && (
                        <Switch.Label className="block text-sm font-medium text-gray-700 cursor-pointer">
                            {label}
                        </Switch.Label>
                    )}
                    {description && (
                        <Switch.Description className="text-sm text-gray-500 mt-0.5">
                            {description}
                        </Switch.Description>
                    )}
                </div>
                <Switch
                    checked={enabled}
                    onChange={onChange}
                    className={clsx(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                        enabled ? 'bg-primary-500' : 'bg-gray-300'
                    )}
                >
                    <span
                        className={clsx(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                            enabled ? 'translate-x-6' : 'translate-x-1'
                        )}
                    />
                </Switch>
            </div>
        </Switch.Group>
    );
}
