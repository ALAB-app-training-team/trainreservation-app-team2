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

    /* 
    const isInvalid: boolean = useMemo(() => {
        return inValidMessages.some((item) => item.message !== '');
    }, [inValidMessages]);
 */
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

    const updateInvalidMessage = (field: string, value: string) => {
        const messages: InValidMessage[] = inValidMessages.filter(
            (item) => item.field !== field,
        );
        if (field === 'name') {
            if (value === '') {
                messages.push({
                    field: 'name',
                    message: '購入者氏名を入力してください',
                });
            }
        } else if (field === 'mail') {
            if (value === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                messages.push({
                    field: 'mail',
                    message: 'メールアドレスの形式で入力してください',
                });
            }
        } else if (field === 'cardNumber') {
            if (value === '' || !/^\d{16,22}$/.test(value)) {
                messages.push({
                    field: 'cardNumber',
                    message: '16-22桁の有効なカード番号を入力してください',
                });
            }
        } else if (field === 'cardName') {
            if (value === '' || !/^[A-Z\s]+$/.test(value)) {
                messages.push({
                    field: 'cardName',
                    message: '半角英大文字・半角スペースで入力してください',
                });
            }
        } else if (field === 'expiry') {
            if (value === '' || !/^\d{2}\/\d{2}$/.test(value)) {
                messages.push({
                    field: 'expiry',
                    message: 'MM/DDの形式で入力してください',
                });
            }
        } else if (field === 'cvc') {
            if (value === '' || !/^\d{3,4}$/.test(value)) {
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
        updateInvalidMessage(e.target.id, value);
    };

    const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateInvalidMessage(e.target.id, e.target.value);
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
