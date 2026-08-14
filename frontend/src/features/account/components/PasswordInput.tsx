import React from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import { PasswordCheckList } from '@/features/account/components/PasswordCheckList';
import type { PasswordCheck } from '@/features/account/types/PasswordCheck';

type PasswordInputProps = {
    id: string;
    label: string;
    type: string;
    value: string;
    placeHolder: string;
    autoComplete: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    getFieldError?: (field: string) => string;
    policy?: PasswordCheck;
    setPasswordType: (value: React.SetStateAction<string>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput({
    id,
    label,
    type,
    value,
    placeHolder,
    autoComplete,
    onChange,
    onBlur,
    getFieldError,
    policy,
    setPasswordType,
}: PasswordInputProps) {
    return (
        <div className="flex flex-col items-start">
            <label htmlFor={id}>{label}</label>
            <div className="flex w-full flex-col gap-2">
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
                    {type === 'password' && (
                        <MdVisibilityOff
                            onClick={() => setPasswordType('text')}
                        />
                    )}
                    {type === 'text' && (
                        <MdVisibility
                            onClick={() => setPasswordType('password')}
                        />
                    )}
                </div>
            </div>
            {getFieldError !== undefined && getFieldError?.(id) && (
                <p className="text-left text-sm text-red-600">
                    {getFieldError(id)}
                </p>
            )}
            {policy !== undefined && <PasswordCheckList policy={policy} />}
        </div>
    );
}
