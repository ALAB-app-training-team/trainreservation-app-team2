import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

type UpdateConfirmModalProps = {
    onClick: () => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
    reservedSeats: ReservedSeatDto[];
    selectedSeats: SeatResponseDto[];
};

export function UpdateConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
    reservedSeats,
    selectedSeats,
}: UpdateConfirmModalProps) {
    return (
        <>
            <div className="flex flex-col items-start justify-center gap-4">
                <div>
                    <h2 className="text-left">予約変更確認</h2>
                    <p>変更を確定しますか？</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="font-bold">変更前</div>
                        <div className="flex flex-col">
                            <ReservedSeats
                                id="updateReservation"
                                title=""
                                seats={reservedSeats}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-bold">変更後</div>
                        <div className="flex flex-col">
                            <ReservedSeats
                                id="updateReservation"
                                title=""
                                seats={selectedSeats.map((seat) => ({
                                    id: '',
                                    trainCarTypeName: '',
                                    trainCarNumber: seat.trainCarNumber,
                                    seatNumber: seat.seatNumber,
                                    seatColumn: seat.seatColumn,
                                    codeToken: '',
                                    seatFare: seat.seatFare,
                                    name: '',
                                    mail: '',
                                }))}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex w-full items-center justify-end gap-4">
                    <button
                        onClick={onRequestClose}
                        disabled={isSubmitting}
                        className="border-primary text-primary rounded-lg border-2 p-2 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-white"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onClick}
                        disabled={isSubmitting}
                        className="bg-primary rounded-lg p-2 text-white"
                    >
                        変更を確定する
                    </button>
                </div>
            </div>
        </>
    );
}
