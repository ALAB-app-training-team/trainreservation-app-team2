import type { ElementType } from 'react';
import React from 'react';

type GuestLoginInputProps = {
    id: string;
    label: string;
    type: string;
    value: string;
    placeholder: string;
    icon: ElementType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function GuestLoginInput({
    id,
    label,
    type,
    value,
    placeholder,
    icon,
    onChange,
    onBlur,
    error,
}: GuestLoginInputProps) {
    return (
        <div className="flex w-full flex-col items-start gap-2">
            <label className="font-bold" htmlFor={id}>
                {label}
            </label>
            <div className="relative w-full">
                {React.createElement(icon, {
                    className:
                        'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
                })}
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className="focus:border-primary bg-primary-light w-full cursor-pointer rounded-xl p-2 pl-10 outline-none focus:border-2"
                />
            </div>
            {error && <p className="text-left text-sm text-red-600">{error}</p>}
        </div>
    );
}
