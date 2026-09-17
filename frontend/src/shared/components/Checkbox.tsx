import type { KeyboardEvent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CheckboxProps = {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: ReactNode;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    dataTestId?: string;
};

export function Checkbox({
    id,
    checked,
    onChange,
    label,
    disabled = false,
    className,
    inputClassName,
    dataTestId,
}: CheckboxProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter' || disabled) return;
        e.preventDefault();
        onChange(!checked);
    };

    return (
        <div
            className={twMerge(
                'flex items-center gap-2',
                disabled && 'cursor-not-allowed',
                className,
            )}
        >
            <input
                type="checkbox"
                id={id}
                data-testid={dataTestId}
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                onKeyDown={handleKeyDown}
                className={twMerge(
                    'accent-primary focus-visible:ring-primary-ink cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none',
                    inputClassName,
                )}
            />
            <label
                htmlFor={id}
                className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            >
                {label}
            </label>
        </div>
    );
}
