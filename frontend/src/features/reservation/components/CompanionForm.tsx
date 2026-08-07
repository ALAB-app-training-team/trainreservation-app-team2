import { useEffect, useRef, useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';

import { GuestLoginInput } from '@/features/reservation/components/GuestLoginInput';
import { useReservationListRequestDto } from '@/features/reservation/hooks/useReservationListRequestDto';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { ReservedSeatUpdateDto } from '@/features/reservation/types/ReservedSeatUpdateDto';

type CompanionFormProps = {
    index: number;
    reservedSeat: ReservedSeatDto;
    onFormChange: (updated: ReservedSeatUpdateDto) => void;
    setIsInvalid: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CompanionForm({
    index,
    reservedSeat,
    onFormChange,
    setIsInvalid,
}: CompanionFormProps) {
    const {
        guestLoginForm,
        handleChange,
        handleBlur,
        getFieldError,
        isInvalid,
    } = useReservationListRequestDto();
    const isInitialized = useRef(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(
        !!(reservedSeat.name && reservedSeat.mail),
    );

    useEffect(() => {
        if (!isInitialized.current) {
            handleChange({
                target: {
                    name: 'reserverName',
                    value: reservedSeat.name ?? '',
                },
            } as React.ChangeEvent<HTMLInputElement>);
            handleChange({
                target: {
                    name: 'reserverMail',
                    value: reservedSeat.mail ?? '',
                },
            } as React.ChangeEvent<HTMLInputElement>);
            isInitialized.current = true;
            return;
        }

        onFormChange({
            id: reservedSeat.id,
            name: canUpdate ? guestLoginForm.reserverName : '',
            mail: canUpdate ? guestLoginForm.reserverMail : '',
        });
    }, [guestLoginForm, canUpdate]);

    useEffect(() => {
        if (!canUpdate) {
            setIsInvalid(false);
        } else {
            setIsInvalid(isInvalid);
        }
    }, [isInvalid, canUpdate]);

    useEffect(() => {
        if (!canUpdate) {
            handleChange({
                target: {
                    name: 'reserverName',
                    value: '',
                },
            } as React.ChangeEvent<HTMLInputElement>);
            handleChange({
                target: {
                    name: 'reserverMail',
                    value: '',
                },
            } as React.ChangeEvent<HTMLInputElement>);
        }
    }, [canUpdate]);

    return (
        <>
            <div className="border-primary-light flex w-full flex-col items-start gap-2 rounded-xl border-2 p-4">
                <div className="flex w-full items-center justify-between">
                    <h2 className="flex gap-2">
                        <div>{reservedSeat.trainCarNumber}号車</div>
                        <div>
                            {reservedSeat.seatNumber}
                            {reservedSeat.seatColumn}
                        </div>
                    </h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`isCompanionUpdated${index}`}
                            checked={canUpdate}
                            onChange={(e) => setCanUpdate(e.target.checked)}
                            className="accent-primary"
                        />
                        <label htmlFor={`isCompanionUpdated${index}`}>
                            同行者を割り当てる
                        </label>
                    </div>
                </div>
                <GuestLoginInput
                    id="reserverName"
                    label="お名前"
                    type="text"
                    inputMode="text"
                    value={guestLoginForm.reserverName}
                    placeHolder={canUpdate ? '山田 太郎' : '割り当てなし'}
                    autoComplete="name"
                    icon={FiUser}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validMessage={
                        canUpdate ? getFieldError('reserverName') : undefined
                    }
                    readOnly={!canUpdate}
                />
                <GuestLoginInput
                    id="reserverMail"
                    label="メールアドレス"
                    type="text"
                    inputMode="email"
                    value={guestLoginForm.reserverMail}
                    placeHolder={
                        canUpdate ? 'example@email.com' : '割り当てなし'
                    }
                    autoComplete="email"
                    icon={CiMail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validMessage={
                        canUpdate ? getFieldError('reserverMail') : undefined
                    }
                    readOnly={!canUpdate}
                />
            </div>
        </>
    );
}
