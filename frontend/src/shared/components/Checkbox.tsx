import type { KeyboardEvent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CheckboxProps = {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: ReactNode;
    disabled?: boolean;
    /** ラッパー div に付与するクラス（gap の調整など） */
    className?: string;
    /** input に付与するクラス（size の調整など） */
    inputClassName?: string;
    dataTestId?: string;
};

/**
 * キーボード操作に対応した共通チェックボックス。
 * - Space に加えて Enter でもチェック状態を切り替える
 *   （form 内では Enter の暗黙送信を抑止する）
 * - focus-visible 時にリングを表示して選択中の項目を分かるようにする
 */
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
