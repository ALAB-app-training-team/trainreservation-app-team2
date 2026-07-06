import React from 'react';
import { type IconType } from 'react-icons';

import type { ReserveUser } from '@/features/schedule/types/ReserveUser';

type ReserveUserInfoInputProps = {
    reserveUser: ReserveUser;
    label: string;
    id: keyof ReserveUser;
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete: string;
    pattern?: string;
    icon?: IconType;
    getFieldError?: (field: string) => string;
};
export function ReserveUserInfoInput({
    reserveUser,
    label,
    id,
    type,
    placeholder,
    onChange,
    onFocus,
    autoComplete,
    pattern,
    icon,
    getFieldError,
}: ReserveUserInfoInputProps) {
    return (
        <>
            <div className="flex w-full flex-col items-start gap-2">
                <label htmlFor={id}>{label}</label>
                <div className="bg-primary-light flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2">
                    {icon && React.createElement(icon)}
                    <input
                        type={type}
                        id={id}
                        value={reserveUser[id]}
                        placeholder={placeholder}
                        onChange={onChange}
                        onFocus={onFocus}
                        autoComplete={autoComplete}
                        pattern={pattern}
                        className="w-full"
                        required
                    />
                </div>
                {getFieldError?.(id) && (
                    <p className="text-left text-sm text-red-600">
                        {getFieldError(id)}
                    </p>
                )}
            </div>
        </>
    );
}
