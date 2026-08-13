import React from 'react';

type AccountInputProps = {
    id: string;
    label: string;
    type: string;
    value: string;
    placeHolder: string;
    autoComplete: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    getFieldError: (field: string) => string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function AccountInput({
    id,
    label,
    type,
    value,
    placeHolder,
    autoComplete,
    onChange,
    onBlur,
    getFieldError,
}: AccountInputProps) {
    return (
        <div className="flex flex-col items-start">
            <label htmlFor={id}>{label}</label>
            <div className="focus-within:border-primary bg-primary-light box-border flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2 outline-none focus-within:border-2">
                <input
                    id={id}
                    type={type}
                    name={id}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeHolder}
                    autoComplete={autoComplete}
                    required
                    className="w-full outline-none [&::-ms-reveal]:hidden"
                />
            </div>
            {getFieldError?.(id) && (
                <p className="text-left text-sm text-red-600">
                    {getFieldError(id)}
                </p>
            )}
        </div>
    );
}
