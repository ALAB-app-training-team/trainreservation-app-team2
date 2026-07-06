import { useMemo, useState } from 'react';
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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReserveUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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

    type InValidMessage = {
        field: keyof ReserveUser;
        message: string;
    };

    const isNameInvalid: boolean = reserveUser.name === '';
    const isMailInvalid: boolean =
        reserveUser.mail === '' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reserveUser.mail);
    const isCardNumberInvalid: boolean =
        reserveUser.cardNumber === '' ||
        !/^\d{16,22}$/.test(reserveUser.cardNumber);
    const isCardNameInvalid: boolean =
        reserveUser.cardName === '' ||
        !/^[A-Z]+\s[A-Z]+$/.test(reserveUser.cardName);
    const isExpiryInvalid: boolean =
        reserveUser.expiry === '' || !/^\d{2}\/\d{2}$/.test(reserveUser.expiry);
    const isCvcInvalid: boolean =
        reserveUser.cvc === '' || !/^\d{3,4}$/.test(reserveUser.cvc);

    const isInvalid: boolean =
        isNameInvalid ||
        isMailInvalid ||
        isCardNumberInvalid ||
        isCardNameInvalid ||
        isExpiryInvalid ||
        isCvcInvalid;

    const inValidMessages: InValidMessage[] = useMemo(() => {
        const messages: InValidMessage[] = [];
        if (isNameInvalid) {
            messages.push({
                field: 'name',
                message: '購入者氏名を入力してください',
            });
        }
        if (isMailInvalid) {
            messages.push({
                field: 'mail',
                message: 'メールアドレスの形式で入力してください',
            });
        }
        if (isCardNumberInvalid) {
            messages.push({
                field: 'cardNumber',
                message: '有効なカード番号を入力してください',
            });
        }
        if (isCardNameInvalid) {
            messages.push({
                field: 'cardName',
                message: '半角英大文字で入力してください',
            });
        }
        if (isExpiryInvalid) {
            messages.push({
                field: 'expiry',
                message: 'MM/DDの形式で入力してください',
            });
        }
        if (isCvcInvalid) {
            messages.push({
                field: 'cvc',
                message: '半角数字で入力してください',
            });
        }

        return messages;
    }, [
        reserveUser.name,
        reserveUser.mail,
        reserveUser.cardNumber,
        reserveUser.cardName,
        reserveUser.expiry,
        reserveUser.cvc,
    ]);

    const getFieldError = (field: string) => {
        return (
            inValidMessages.find((item) => item.field === field)?.message ?? ''
        );
    };

    return {
        reserveUser,
        focus,
        handleInputChange,
        handleInputFocus,
        isInvalid,
        getFieldError,
    };
}
