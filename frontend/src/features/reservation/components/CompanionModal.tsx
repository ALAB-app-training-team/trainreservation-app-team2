import { useState } from 'react';

import { CompanionForm } from '@/features/reservation/components/CompanionForm';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { ReservedSeatUpdateDto } from '@/features/reservation/types/ReservedSeatUpdateDto';

type CompanionModalProps = {
    isInvalid: boolean;
    setIsInvalid: React.Dispatch<React.SetStateAction<boolean>>;
    isSubmitting: boolean;
    reservedSeats: ReservedSeatDto[];
    handleSubmit: (formValues: ReservedSeatUpdateDto[]) => void;
};

export function CompanionModal({
    isInvalid,
    setIsInvalid,
    isSubmitting,
    reservedSeats,
    handleSubmit,
}: CompanionModalProps) {
    const [formValues, setFormValues] = useState<ReservedSeatUpdateDto[]>(() =>
        reservedSeats.map((seat) => ({
            id: seat.id,
            name: seat.name ?? '',
            mail: seat.mail ?? '',
        })),
    );

    const handleFormChange = (
        index: number,
        updatedValue: ReservedSeatUpdateDto,
    ) => {
        setFormValues((prev) => {
            const next = [...prev];
            next[index] = updatedValue;
            return next;
        });
    };
    return (
        <>
            <div className="flex flex-col gap-2 p-2">
                <div>
                    <h2>同行者に割り当て</h2>
                    <div>同行者の情報を入力してチケットを配布します</div>
                </div>
                {reservedSeats.map((reservedSeat, index) => (
                    <CompanionForm
                        key={reservedSeat.id}
                        index={index}
                        reservedSeat={reservedSeat}
                        onFormChange={(updated) =>
                            handleFormChange(index, updated)
                        }
                        setIsInvalid={setIsInvalid}
                    />
                ))}
                <button
                    type="button"
                    onClick={() => handleSubmit(formValues)}
                    disabled={isSubmitting || isInvalid}
                    className="bg-primary w-full rounded-lg p-2 text-white"
                >
                    確定
                </button>
            </div>
        </>
    );
}
