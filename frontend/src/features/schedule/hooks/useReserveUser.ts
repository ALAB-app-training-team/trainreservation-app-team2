import { useState } from 'react';
import type { Focused } from 'react-credit-cards-2';

import type { ReserveUser } from '@/features/schedule/types/ReserveUser';
import { VALIDATE_MESSAGE } from '@/shared/constants/ValidateMessages';
import { checkMailRegex } from '@/shared/utils/CheckMailRegex';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function useReserveUser() {
    const [reserveUser, setReserveUser] = useState<ReserveUser>({
        reserverName: '',
        reserverMail: '',
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvc: '',
    });
    const [focus, setFocus] = useState<Focused>('');
    type InValidMessage = {
        field: keyof ReserveUser;
        message: string;
    };
    const [inValidMessages, setInValidMessages] = useState<InValidMessage[]>(
        [],
    );

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
    const isCardNumberInvalid = (value: string) => {
        return value === '' || !/^\d{14,16}$/.test(value);
    };
    const isCardNameEmpty = (value: string) => {
        return removeWhiteSpace(value) === '';
    };
    const isCardNameInvalid = (value: string) => {
        return !/^[A-Z\s]+$/.test(value);
    };
    const isExpiryInvalid = (value: string) => {
        return value === '' || !/^\d{2}\/\d{2}$/.test(value);
    };
    const isCvcInvalid = (value: string) => {
        return value === '' || !/^\d{3,4}$/.test(value);
    };

    const checkInvalid = (reserveUser: ReserveUser) => {
        return (
            isNameEmpty(reserveUser.reserverName) ||
            isNameMaxLength(reserveUser.reserverName) ||
            isMailEmpty(reserveUser.reserverMail) ||
            isMailInvalid(reserveUser.reserverMail) ||
            isMailMaxLength(reserveUser.reserverMail) ||
            isCardNumberInvalid(reserveUser.cardNumber) ||
            isCardNameEmpty(reserveUser.cardName) ||
            isCardNameInvalid(reserveUser.cardName) ||
            isExpiryInvalid(reserveUser.expiry) ||
            isCvcInvalid(reserveUser.cvc)
        );
    };

    const isInvalid = checkInvalid(reserveUser);

    const editValidateMessage = (field: string, value: string) => {
        const messages: InValidMessage[] = inValidMessages.filter(
            (item) => item.field !== field,
        );
        if (field === 'reserverName') {
            if (isNameEmpty(value)) {
                messages.push({
                    field: 'reserverName',
                    message: VALIDATE_MESSAGE.EMPTY_RESERVER_NAME,
                });
            }
            if (isNameMaxLength(value)) {
                messages.push({
                    field: 'reserverName',
                    message: VALIDATE_MESSAGE.MAX_LENGTH_RESERVER_NAME,
                });
            }
        } else if (field === 'reserverMail') {
            if (isMailEmpty(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: VALIDATE_MESSAGE.EMPTY_RESERVER_MAIL,
                });
            }
            if (isMailMaxLength(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: VALIDATE_MESSAGE.MAX_LENGTH_RESERVER_MAIL,
                });
            }
            if (isMailInvalid(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: VALIDATE_MESSAGE.VALID_RESERVER_MAIL,
                });
            }
        } else if (field === 'cardNumber') {
            if (isCardNumberInvalid(value)) {
                messages.push({
                    field: 'cardNumber',
                    message: VALIDATE_MESSAGE.VALID_CARD_NUMBER,
                });
            }
        } else if (field === 'cardName') {
            if (isCardNameEmpty(value)) {
                messages.push({
                    field: 'cardName',
                    message: VALIDATE_MESSAGE.EMPTY_CARD_NAME,
                });
            }
            if (isCardNameInvalid(value)) {
                messages.push({
                    field: 'cardName',
                    message: VALIDATE_MESSAGE.VALID_CARD_NAME,
                });
            }
        } else if (field === 'expiry') {
            if (isExpiryInvalid(value)) {
                messages.push({
                    field: 'expiry',
                    message: VALIDATE_MESSAGE.VALID_EXPIRY,
                });
            }
        } else if (field === 'cvc') {
            if (isCvcInvalid(value)) {
                messages.push({
                    field: 'cvc',
                    message: VALIDATE_MESSAGE.VALID_CVC,
                });
            }
        }
        setInValidMessages(messages);
    };

    const getFieldError = (field: string) => {
        return (
            inValidMessages.find((item) => item.field === field)?.message ?? ''
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
        if (e.target.id === 'cardName') {
            value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, '');
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
    };

    const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        editValidateMessage(e.target.id, e.target.value);
    };

    return {
        reserveUser,
        focus,
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        isInvalid,
        getFieldError,
    };
}
