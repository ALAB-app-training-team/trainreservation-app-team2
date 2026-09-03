import { FaCheck, FaTimes } from 'react-icons/fa';

import type { PasswordCheck } from '@/features/account/types/PasswordCheck';

type PasswordCheckListProps = {
    policy: PasswordCheck;
};

const style = {
    isValid: 'flex items-center text-success',
    isInvalid: 'flex items-center text-danger',
};

export function PasswordCheckList({ policy }: PasswordCheckListProps) {
    return (
        <ul className="apace-y-1 mt-3 text-sm">
            <li className="text-left">
                使用できる文字は半角数字・半角英大文字・半角英小文字・記号（'-!"#$%&(),./:;?@[]^_`
                &#123;&#125;~+&lt;=&gt;*）です
            </li>
            <li
                className={
                    policy.isBetweenLength ? style.isValid : style.isInvalid
                }
            >
                {policy.isBetweenLength ? <FaCheck /> : <FaTimes />}
                8文字以上64文字以下
            </li>
            <li className={policy.hasNumber ? style.isValid : style.isInvalid}>
                {policy.hasNumber ? <FaCheck /> : <FaTimes />}
                半角数字を含む
            </li>
            <li
                className={
                    policy.hasUppercase ? style.isValid : style.isInvalid
                }
            >
                {policy.hasUppercase ? <FaCheck /> : <FaTimes />}
                半角英大文字を含む
            </li>
            <li
                className={
                    policy.hasLowercase ? style.isValid : style.isInvalid
                }
            >
                {policy.hasLowercase ? <FaCheck /> : <FaTimes />}
                半角英小文字を含む
            </li>
            <li className={policy.isValid ? style.isValid : style.isInvalid}>
                {policy.isValid ? <FaCheck /> : <FaTimes />}
                使用できる文字のみで構成されている
            </li>
        </ul>
    );
}
