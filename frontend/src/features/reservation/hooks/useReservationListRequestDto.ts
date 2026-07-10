import { useState } from 'react';

import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';

export function useReservationListRequestDto() {
    const [guestLoginForm, setGuestLoginForm] =
        useState<ReservationListRequestDto>({
            reserverName: '',
            reserverMail: '',
        });
    type InValidMessage = {
        field: keyof ReservationListRequestDto;
        message: string;
    };
    const [inValidMessages, setInValidMessages] = useState<InValidMessage[]>(
        [],
    );
    const isNameEmpty = (value: string) => {
        return value === '';
    };
    const isMailEmpty = (value: string) => {
        return value === '';
    };
    const isMailInValid = (value: string) => {
        return !/^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
            value,
        );
    };
    const editValidateMessage = (field: string, value: string) => {
        const messages: InValidMessage[] = inValidMessages.filter(
            (item) => item.field !== field,
        );
        if (field === 'reserverName') {
            if (isNameEmpty(value)) {
                messages.push({
                    field: 'reserverName',
                    message: '予約者氏名を入力してください',
                });
            }
        } else if (field === 'reserverMail') {
            if (isMailEmpty(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: 'メールアドレスを入力してください',
                });
            } else if (isMailInValid(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: '正しいメールアドレスの形式で入力してください',
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGuestLoginForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        editValidateMessage(name, value);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        editValidateMessage(name, value);
    };

    const checkInvalid = (guestLoginForm: ReservationListRequestDto) => {
        return (
            isNameEmpty(guestLoginForm.reserverName) ||
            isMailEmpty(guestLoginForm.reserverName) ||
            isMailInValid(guestLoginForm.reserverMail)
        );
    };

    const isInvalid = checkInvalid(guestLoginForm);

    return {
        guestLoginForm,
        handleChange,
        handleBlur,
        getFieldError,
        isInvalid,
    };
}
