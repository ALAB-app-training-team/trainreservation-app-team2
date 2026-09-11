import dayjs from 'dayjs';
import { useMemo } from 'react';

import { VALIDATION_MESSAGE } from '@/shared/constants/ValidationMessages';

type InvalidMessage = {
    field: 'date' | 'arrivalStation';
    message: string;
};

export function useSearchRequestValidation(
    date: string,
    departureStation: string,
    arrivalStation: string,
) {
    const maxDate = dayjs().add(1, 'month').endOf('day').toDate();
    const minDate = dayjs().startOf('day').toDate();

    const isDateEmpty: boolean = date === '';
    const isDateOutsideOneMonth: boolean =
        new Date(date) < minDate || new Date(date) > maxDate;
    const isStationSame: boolean = departureStation === arrivalStation;

    const isInvalid: boolean =
        isDateEmpty || isDateOutsideOneMonth || isStationSame;

    const invalidMessages: InvalidMessage[] = useMemo(() => {
        const messages: InvalidMessage[] = [];
        if (isDateEmpty) {
            messages.push({
                field: 'date',
                message: VALIDATION_MESSAGE.EMPTY_DATE,
            });
        }
        if (isDateOutsideOneMonth) {
            messages.push({
                field: 'date',
                message: VALIDATION_MESSAGE.OUTSIDE_ONE_MONTH,
            });
        }
        if (isStationSame) {
            messages.push({
                field: 'arrivalStation',
                message: VALIDATION_MESSAGE.SAME_STATION,
            });
        }

        return messages;
    }, [date, departureStation, arrivalStation]);

    const getFieldError = (field: string) => {
        return (
            invalidMessages.find((item) => item.field === field)?.message ?? ''
        );
    };

    return { isInvalid, getFieldError, maxDate, minDate };
}
