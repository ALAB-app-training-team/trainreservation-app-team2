import { useState } from 'react';

import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';
import { checkMailRegex } from '@/shared/utils/CheckMailRegex';
import { removeWhiteSpace } from '@/shared/utils/RemoveWhiteSpace';

export function useReservationListRequestDto() {
    const [guestLoginForm, setGuestLoginForm] =
        useState<ReservationListRequestDto>({
            reserverName: '',
            reserverMail: '',
        });
    type InvalidMessage = {
        field: keyof ReservationListRequestDto;
        message: string;
    };
    const [invalidMessages, setInvalidMessages] = useState<InvalidMessage[]>(
        [],
    );

    const isNameEmpty = (value: string) => {
        return removeWhiteSpace(value) === '';
    };
    const isMailEmpty = (value: string) => {
        return removeWhiteSpace(value) === '';
    };
    const isMailInvalid = (value: string) => {
        return checkMailRegex(value);
    };

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
        } else if (field === 'reserverMail') {
            if (isMailEmpty(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: VALIDATION_MESSAGE.EMPTY_MAIL,
                });
            } else if (isMailInvalid(value)) {
                messages.push({
                    field: 'reserverMail',
                    message: VALIDATION_MESSAGE.INVALID_MAIL,
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
            isMailInvalid(guestLoginForm.reserverMail)
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
