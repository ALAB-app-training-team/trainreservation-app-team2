import { FaArrowDown } from 'react-icons/fa';

import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { UpdatedReservationInfo } from '@/features/schedule/components/UpdatedReservationInfo';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import { CustomModalTitle } from '@/shared/components/CustomModalTitle';

type UpdateConfirmModalProps = {
    onClick: () => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
    reservedSeats: ReservedSeatDto[];
    selectedSeats: SeatResponseDto[];
    scheduleInfo: ScheduleInfoDto;
    preChangeScheduleInfo?: ScheduleInfoDto;
};

export function UpdateConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
    reservedSeats,
    selectedSeats,
    scheduleInfo,
    preChangeScheduleInfo,
}: UpdateConfirmModalProps) {
    const isScheduleChanged =
        scheduleInfo.scheduleCd !== preChangeScheduleInfo?.scheduleCd ||
        scheduleInfo.date !== preChangeScheduleInfo.date;

    return (
        <>
            <div className="flex flex-col items-start justify-center gap-1 py-2">
                <CustomModalTitle
                    title="予約変更確認"
                    onRequestClose={onRequestClose}
                    isSubmitting={isSubmitting}
                />
                <div>変更を確定しますか？</div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-bold">変更前</div>
                {isScheduleChanged && preChangeScheduleInfo ? (
                    <UpdatedReservationInfo
                        detail={preChangeScheduleInfo}
                        seats={reservedSeats}
                    />
                ) : (
                    <ReservedSeats
                        id="updateReservation"
                        title=""
                        seats={reservedSeats}
                    />
                )}
                <FaArrowDown className="self-center" />
                <div className="font-bold">変更後</div>
                {isScheduleChanged ? (
                    <UpdatedReservationInfo
                        detail={scheduleInfo}
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
                ) : (
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
                )}
            </div>
            <div className="flex w-full items-center justify-end gap-4 p-2">
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
        </>
    );
}
