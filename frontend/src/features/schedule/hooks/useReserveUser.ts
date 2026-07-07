import { useState } from 'react';
import type { Focused } from 'react-credit-cards-2';

import type { ReserveUser } from '@/features/schedule/types/ReserveUser';

export function useReserveUser() {
    const [reserveUser, setReserveUser] = useState<ReserveUser>({
        name: '',
        mail: '',
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

    const isNameInvalid = (value: string) => {
        return value === '';
    };
    const isMailInvalid = (value: string) => {
        return value === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };
    const isCardNumberInvalid = (value: string) => {
        return value === '' || !/^\d{16,22}$/.test(value);
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
            isNameInvalid(reserveUser.name) ||
            isMailInvalid(reserveUser.mail) ||
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
        if (field === 'name') {
            if (isNameInvalid(value)) {
                messages.push({
                    field: 'name',
                    message: '購入者氏名を入力してください',
                });
            }
        } else if (field === 'mail') {
            if (isMailInvalid(value)) {
                messages.push({
                    field: 'mail',
                    message: 'メールアドレスの形式で入力してください',
                });
            }
        } else if (field === 'cardNumber') {
            if (isCardNumberInvalid(value)) {
                messages.push({
                    field: 'cardNumber',
                    message: '16-22桁の有効なカード番号を入力してください',
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
                    message: 'MM/DDの形式で入力してください',
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
