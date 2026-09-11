import { useState } from 'react';
import type { Focused } from 'react-credit-cards-2';

import type { PasswordCheck } from '@/features/account/types/PasswordCheck';
import type { ReserveUser } from '@/features/schedule/types/ReserveUser';
import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';
import { usePasswordPolicy } from '@/shared/hooks/usePasswordPolicy';
import { checkMailRegex } from '@/shared/utils/CheckMailRegex';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function useReserveUser() {
    const [reserveUser, setReserveUser] = useState<ReserveUser>({
        reserverName: '',
        reserverMail: '',
        password: '',
        passwordCheck: '',
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvc: '',
    });
    const { getPasswordPolicy } = usePasswordPolicy();
    const [isAccountCreate, setIsAccountCreate] = useState(false);
    const [focus, setFocus] = useState<Focused>('');
    type InvalidMessage = {
        field: keyof ReserveUser;
        message: string;
    };
    const [invalidMessages, setInvalidMessages] = useState<InvalidMessage[]>(
        [],
    );
    const isLoggedIn = !!localStorage.getItem('name');

    const policy: PasswordCheck = getPasswordPolicy(reserveUser.password);

    const isNameEmpty = (value: string) => {
        return removeWhiteSpace(value) === '';
    };
    const isNameMaxLength = (value: string) => {
        return value.length > 255;
    };
    const isMailEmpty = (value: string) => {
        return removeWhiteSpace(value) === '';
    };
    const isMailInvalid = (value: string) => {
        return checkMailRegex(value);
    };
    const isMailMaxLength = (value: string) => {
        return value.length > 255;
    };
    const isPasswordCheckEmpty = (value: string) => {
        return value === '';
    };
    const isNotMatchPassword = (value: string) => {
        return reserveUser.password !== value;
    };
    const isCardNumberInvalid = (value: string) => {
        return value === '' || !/^\d{14,16}$/.test(value);
    };
    const isCardNameEmpty = (value: string) => {
        return removeWhiteSpace(value) === '';
    };
    const isCardNameInvalid = (value: string) => {
        return !/^[A-Z\s]+$/.test(value);
    };
    const isExpiryFormatInvalid = (value: string) => {
        return value === '' || !/^\d{2}\/\d{2}$/.test(value);
    };
    const parseExpiry = (value: string) => {
        const match = /^(\d{2})\/(\d{2})$/.exec(value);
        if (!match) {
            return null;
        }
        return { month: Number(match[1]), year: Number(match[2]) };
    };
    const isExpiryMonthInvalid = (value: string) => {
        const parsed = parseExpiry(value);
        return parsed !== null && (parsed.month < 1 || parsed.month > 12);
    };
    const isExpiryPast = (value: string) => {
        const parsed = parseExpiry(value);
        if (parsed === null || isExpiryMonthInvalid(value)) {
            return false;
        }
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        return (
            parsed.year < currentYear ||
            (parsed.year === currentYear && parsed.month < currentMonth)
        );
    };
    const isExpiryTooFuture = (value: string) => {
        const parsed = parseExpiry(value);
        if (parsed === null || isExpiryMonthInvalid(value)) {
            return false;
        }
        const currentYear = new Date().getFullYear() % 100;
        return parsed.year > currentYear + 10;
    };
    const isExpiryInvalid = (value: string) => {
        return (
            isExpiryFormatInvalid(value) ||
            isExpiryMonthInvalid(value) ||
            isExpiryPast(value) ||
            isExpiryTooFuture(value)
        );
    };
    const isCvcInvalid = (value: string) => {
        return value === '' || !/^\d{3,4}$/.test(value);
    };

    const getExpiryErrorMessage = (value: string): string | null => {
        if (isExpiryFormatInvalid(value)) {
            return VALIDATION_MESSAGE.INVALID_EXPIRY;
        }
        if (isExpiryMonthInvalid(value)) {
            return VALIDATION_MESSAGE.INVALID_EXPIRY_MONTH;
        }
        if (isExpiryPast(value)) {
            return VALIDATION_MESSAGE.EXPIRY_PAST;
        }
        if (isExpiryTooFuture(value)) {
            return VALIDATION_MESSAGE.EXPIRY_TOO_FUTURE;
        }
        return null;
    };

    const isReserverInfoInvalid = (reserveUser: ReserveUser) => {
        return (
            isNameEmpty(reserveUser.reserverName) ||
            isNameMaxLength(reserveUser.reserverName) ||
            isMailEmpty(reserveUser.reserverMail) ||
            isMailInvalid(reserveUser.reserverMail) ||
            isMailMaxLength(reserveUser.reserverMail)
        );
    };

    const isAccountCreateInvalid = (reserveUser: ReserveUser) => {
        return (
            !policy.isBetweenLength ||
            !policy.hasNumber ||
            !policy.hasUppercase ||
            !policy.hasLowercase ||
            !policy.isValid ||
            isPasswordCheckEmpty(reserveUser.passwordCheck) ||
            isNotMatchPassword(reserveUser.passwordCheck)
        );
    };

    const isCardInfoInvalid = (reserveUser: ReserveUser) => {
        return (
            isCardNumberInvalid(reserveUser.cardNumber) ||
            isCardNameEmpty(reserveUser.cardName) ||
            isCardNameInvalid(reserveUser.cardName) ||
            isExpiryInvalid(reserveUser.expiry) ||
            isCvcInvalid(reserveUser.cvc)
        );
    };

    const checkInvalid = (reserveUser: ReserveUser) => {
        return (
            (!isLoggedIn && isReserverInfoInvalid(reserveUser)) ||
            (isAccountCreate && isAccountCreateInvalid(reserveUser)) ||
            isCardInfoInvalid(reserveUser)
        );
    };

    const isInvalid = checkInvalid(reserveUser);

    const editValidateMessage = (field: string, value: string) => {
        const messages: InvalidMessage[] = invalidMessages.filter(
            (item) => item.field !== field,
        );
        if (field === 'reserverName') {
            if (isNameEmpty(value)) {
                messages.push({
                    field: 'reserverName',
                    message: VALIDATION_MESSAGE.EMPTY_RESERVER_NAME,
                });
            }
            if (isNameMaxLength(value)) {
                messages.push({
                    field: 'reserverName',
                    message: VALIDATION_MESSAGE.MAX_LENGTH_RESERVER_NAME,
                });
            }
        } else if (field === 'reserverMail') {
            if (isMailEmpty(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: VALIDATION_MESSAGE.EMPTY_MAIL,
                });
            }
            if (isMailMaxLength(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: VALIDATION_MESSAGE.MAX_LENGTH_MAIL,
                });
            }
            if (isMailInvalid(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: VALIDATION_MESSAGE.INVALID_MAIL,
                });
            }
        } else if (field === 'passwordCheck') {
            if (isPasswordCheckEmpty(value)) {
                messages.push({
                    field: 'passwordCheck',
                    message: VALIDATION_MESSAGE.EMPTY_PASSWORD_CHECK,
                });
            }
            if (isNotMatchPassword(value)) {
                messages.push({
                    field: 'passwordCheck',
                    message: VALIDATION_MESSAGE.PASSWORD_NOT_MATCH,
                });
            }
        } else if (field === 'cardNumber') {
            if (isCardNumberInvalid(value)) {
                messages.push({
                    field: 'cardNumber',
                    message: VALIDATION_MESSAGE.INVALID_CARD_NUMBER,
                });
            }
        } else if (field === 'cardName') {
            if (isCardNameEmpty(value)) {
                messages.push({
                    field: 'cardName',
                    message: VALIDATION_MESSAGE.EMPTY_CARD_NAME,
                });
            }
            if (isCardNameInvalid(value)) {
                messages.push({
                    field: 'cardName',
                    message: VALIDATION_MESSAGE.INVALID_CARD_NAME,
                });
            }
        } else if (field === 'expiry') {
            const expiryMessage = getExpiryErrorMessage(value);
            if (expiryMessage !== null) {
                messages.push({ field: 'expiry', message: expiryMessage });
            }
        } else if (field === 'cvc') {
            if (isCvcInvalid(value)) {
                messages.push({
                    field: 'cvc',
                    message: VALIDATION_MESSAGE.INVALID_CVC,
                });
            }
        }
        setInvalidMessages(messages);
    };

    const getFieldError = (field: string) => {
        return (
            invalidMessages.find((item) => item.field === field)?.message ?? ''
        );
    };

    const handleInputFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === 'cardNumber') {
            setFocus('number');
        } else if (e.target.id === 'cardName') {
            setFocus('name');
        } else if (e.target.id === 'expiry') {
            setFocus('expiry');
        } else if (e.target.id === 'cvc') {
            setFocus('cvc');
        } else {
            setFocus('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 自動フォーマット
        let value = e.target.value;
        if (e.target.id === 'cardNumber') {
            value = e.target.value.replace(/[^0-9]/g, '').slice(0, 22);
        }
        if (e.target.id === 'cvc') {
            value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
        }
        if (e.target.id === 'expiry') {
            value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
        }
        setReserveUser((prev) => ({ ...prev, [e.target.id]: value }));
        editValidateMessage(e.target.id, value);
        if (reserveUser.passwordCheck !== '' && e.target.id === 'password') {
            editValidateMessage('passwordCheck', reserveUser.passwordCheck);
        }
    };

    const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        editValidateMessage(e.target.id, e.target.value);
        if (reserveUser.passwordCheck !== '' && e.target.id === 'password') {
            editValidateMessage('passwordCheck', reserveUser.passwordCheck);
        }
    };

    return {
        reserveUser,
        focus,
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        isInvalid,
        getFieldError,
        isAccountCreate,
        setIsAccountCreate,
        policy,
    };
}
