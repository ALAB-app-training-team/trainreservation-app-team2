import { CompanionForm } from '@/features/reservation/components/CompanionForm';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

type CompanionModalProps = {
    isSubmitting: boolean;
    reservedSeats: ReservedSeatDto[];
    handleSubmit: () => void;
};

export function CompanionModal({
    isSubmitting,
    reservedSeats,
    handleSubmit,
}: CompanionModalProps) {
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
                    disabled={isSubmitting}
                    className="bg-primary w-full rounded-lg p-2 text-white"
                >
                    確定
                </button>
            </div>
        </>
    );
}
