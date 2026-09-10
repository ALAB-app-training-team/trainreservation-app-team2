import { FaArrowDown } from 'react-icons/fa';

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
    const prevFare = reservedSeats.reduce(
        (accumulator, seat) => accumulator + seat.seatFare,
        0,
    );
    const newFare = selectedSeats.reduce(
        (accumulator, seat) => accumulator + seat.seatFare,
        0,
    );
    const fareDifference = newFare - prevFare;
    const fareDifferenceLabel =
        fareDifference > 0
            ? '差額（追加でお支払い）'
            : fareDifference < 0
              ? '差額（払い戻し）'
              : '差額';
    const fareDifferenceAmount =
        fareDifference < 0
            ? `-￥${Math.abs(fareDifference).toLocaleString()}`
            : `${fareDifference > 0 ? '+' : ''}￥${fareDifference.toLocaleString()}`;
    const fareDifferenceColor =
        fareDifference > 0
            ? 'text-red-600'
            : fareDifference < 0
              ? 'text-primary'
              : 'text-gray-900';

    return (
        <>
            <div className="flex flex-col items-start justify-center gap-1 pb-2">
                <CustomModalTitle
                    title="予約変更確認"
                    onRequestClose={onRequestClose}
                    isSubmitting={isSubmitting}
                />
                <div>変更を確定しますか？</div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-bold">変更前</div>
                {(preChangeScheduleInfo ?? scheduleInfo) && (
                    <UpdatedReservationInfo
                        detail={preChangeScheduleInfo ?? scheduleInfo}
                        seats={reservedSeats}
                    />
                )}
                <FaArrowDown className="self-center" />
                <div className="font-bold">変更後</div>
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
            </div>
            <div className="m-2 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                <span className="text-sm text-gray-500">
                    {fareDifferenceLabel}
                </span>
                <span className={`text-lg font-bold ${fareDifferenceColor}`}>
                    {fareDifferenceAmount}
                </span>
            </div>
            <div className="flex w-full items-center justify-end gap-4 p-1">
                <button
                    onClick={onRequestClose}
                    disabled={isSubmitting}
                    className="border-primary-ink text-primary-ink disabled:border-line-strong disabled:bg-surface-disabled rounded-lg border-2 p-2 disabled:text-white"
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
