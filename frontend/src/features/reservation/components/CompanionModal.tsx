import type { ReservedSeatUpdateDto } from '@features/reservation/types/ReservedSeatUpdateDto';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import { CompanionForm } from '@/features/reservation/components/CompanionForm';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

type CompanionModalProps = {
    reservationId: string;
    reservedSeats: ReservedSeatDto[];
};

export function CompanionModal({
    reservationId,
    reservedSeats,
}: CompanionModalProps) {
    const handleSubmit = async () => {
        const request: ReservedSeatUpdateDto[] = reservedSeats.map((seat) => ({
            id: seat.id,
            name: seat.name,
            mail: seat.mail,
        }));
        await apiClient.patch(ENDPOINTS.RESERVEDSEAT(reservationId), request);
    };
    return (
        <>
            <div className="flex flex-col gap-2">
                <div>
                    <h2>同行者に割り当て</h2>
                    <div>同行者の情報を入力してチケットを配布します</div>
                </div>
                {reservedSeats.map((reservedSeat, index) => (
                    <CompanionForm
                        key={reservedSeat.id}
                        index={index}
                        reservedSeats={reservedSeats}
                    />
                ))}
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-primary w-full rounded-lg p-2 text-white"
                >
                    確定
                </button>
            </div>
        </>
    );
}
