import { useEffect } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';

import { GuestLoginInput } from '@/features/reservation/components/GuestLoginInput';
import { useReservationListRequestDto } from '@/features/reservation/hooks/useReservationListRequestDto';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

type CompanionFormProps = {
    index: number;
    reservedSeats: ReservedSeatDto[];
};

export function CompanionForm({ index, reservedSeats }: CompanionFormProps) {
    const { guestLoginForm, handleChange, handleBlur, getFieldError } =
        useReservationListRequestDto();

    useEffect(() => {
        reservedSeats[index].name = guestLoginForm.reserverName;
        reservedSeats[index].mail = guestLoginForm.reserverMail;
    }, [guestLoginForm]);

    return (
        <>
            <div className="border-primary-light flex w-full flex-col items-start gap-2 rounded-xl border-2 p-4">
                <h2 className="flex gap-2">
                    <div>{reservedSeats[index].trainCarNumber}号車</div>
                    <div>
                        {reservedSeats[index].seatNumber}
                        {reservedSeats[index].seatColumn}
                    </div>
                </h2>
                <GuestLoginInput
                    id="reserverName"
                    label="お名前"
                    type="text"
                    inputMode="text"
                    value={guestLoginForm.reserverName}
                    placeHolder="山田 太郎"
                    autoComplete="name"
                    icon={FiUser}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validMessage={getFieldError('reserverName')}
                    readOnly={false}
                />
                <GuestLoginInput
                    id="reserverMail"
                    label="メールアドレス"
                    type="text"
                    inputMode="email"
                    value={guestLoginForm.reserverMail}
                    placeHolder="example@email.com"
                    autoComplete="email"
                    icon={CiMail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validMessage={getFieldError('reserverMail')}
                    readOnly={false}
                />
            </div>
        </>
    );
}
