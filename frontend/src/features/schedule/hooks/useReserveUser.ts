import { useState } from 'react';
import type { Focused } from 'react-credit-cards-2';

import type { ReserveUser } from '@/features/schedule/types/ReserveUser';

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
        return value === '';
    };
    const isNameMaxLength = (value: string) => {
        return value.length > 255;
    };
    const isMailInvalid = (value: string) => {
        return value === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };
    const isMailMaxLength = (value: string) => {
        return value.length > 255;
    };
    const isCardNumberInvalid = (value: string) => {
        return value === '' || !/^\d{14,16}$/.test(value);
    };
    const isCardNameInvalid = (value: string) => {
        return value === '' || !/^[A-Z\s]+$/.test(value);
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
            isMailInvalid(reserveUser.reserverMail) ||
            isMailMaxLength(reserveUser.reserverMail) ||
            isCardNumberInvalid(reserveUser.cardNumber) ||
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
                    message: '購入者氏名を入力してください',
                });
            }
            if (isNameMaxLength(value)) {
                messages.push({
                    field: 'reserverName',
                    message: '購入者氏名は255文字以内で入力してください',
                });
            }
        } else if (field === 'reserverMail') {
            if (isMailMaxLength(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: 'メールアドレスは255文字以内で入力してください',
                });
            }
            if (isMailInvalid(value)) {
                messages.push({
                    field: 'reserverMail',
                    message:
                        'メールアドレスの形式（~~@~~.~~）で入力してください',
                });
            }
        } else if (field === 'cardNumber') {
            if (isCardNumberInvalid(value)) {
                messages.push({
                    field: 'cardNumber',
                    message: '14-16桁の有効なカード番号を入力してください',
                });
            }
        } else if (field === 'cardName') {
            if (isCardNameInvalid(value)) {
                messages.push({
                    field: 'cardName',
                    message: '半角英大文字・半角スペースで入力してください',
                });
            }
        } else if (field === 'expiry') {
            if (isExpiryInvalid(value)) {
                messages.push({
                    field: 'expiry',
                    message: '月/年の形式で入力してください',
                });
            }
        } else if (field === 'cvc') {
            if (isCvcInvalid(value)) {
                messages.push({
                    field: 'cvc',
                    message: '半角数字3-4桁で入力してください',
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
