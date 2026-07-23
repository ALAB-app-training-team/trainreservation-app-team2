import dayjs from 'dayjs';

import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import { FARE_CONSTANTS } from '@/features/reservation/constants/FareConstant';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

type ReservationRefundConfirmModalProps = {
    onClick: (reeservationId: string) => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
    details: ReservationResponseDto;
};

export function ReservationRefundConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
    details,
}: ReservationRefundConfirmModalProps) {
    const countSeat: number = details.reservedSeats.length;
    const seatFare: number = details.reservedSeats.reduce(
        (sum, seat) => sum + seat.seatFare,
        0,
    );
    return (
        <>
            <div className="justify-er flex flex-col items-start gap-4">
                <h1 className="!m-0 text-left !text-xl">予約キャンセル確認</h1>
                <div>以下の予約を取り消しますか？</div>

                <div>
                    <span className="text-xl font-bold">
                        {dayjs(details.rideDate).format('YYYY年MM月DD日')}
                        <br />
                        {dayjs(details.departureTime, 'HH:mm:ss').format(
                            'HH:mm',
                        )}
                        発
                    </span>
                </div>
                <div className="text-2xl font-bold">
                    {details.departureStationName} →{' '}
                    {details.arrivalStationName}
                </div>
                <ReservedSeats
                    id="reservationList"
                    title=""
                    seats={details.reservedSeats}
                />
                <div className="flex w-full flex-col gap-2 rounded-lg bg-slate-50 p-3">
                    <div className="flex justify-between">
                        <span>チケット料金</span>
                        <span>{seatFare}円</span>
                    </div>
                    <div className="flex justify-between">
                        <span>払い戻し手数料</span>
                        <span>-{countSeat * FARE_CONSTANTS.REFUND}円</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>払い戻し金額</span>{' '}
                        <span>
                            {seatFare - countSeat * FARE_CONSTANTS.REFUND}円
                        </span>
                    </div>
                </div>
                <div className="flex w-full items-center justify-end gap-4">
                    <button
                        onClick={onRequestClose}
                        disabled={isSubmitting}
                        className="border-primary text-primary rounded-lg border-2 p-2 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-white"
                    >
                        予約を取消さない
                    </button>
                    <button
                        data-testid={'refund-confirm-button'}
                        onClick={() => onClick(details.reservationId!)}
                        disabled={isSubmitting}
                        className="bg-primary rounded-lg p-2 text-white"
                    >
                        予約を取り消す
                    </button>
                </div>
            </div>
        </>
    );
}
