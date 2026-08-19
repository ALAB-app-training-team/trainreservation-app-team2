import { ReservationInfo } from '@/features/reservation/components/ReservationInfo';
import { FARE_CONSTANTS } from '@/features/reservation/constants/FareConstant';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import { CustomModalTitle } from '@/shared/components/CustomModalTitle';

type ReservationRefundConfirmModalProps = {
    onClick: (reeservationId: string) => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
    detail: ReservationResponseDto;
};

export function ReservationRefundConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
    detail,
}: ReservationRefundConfirmModalProps) {
    const countSeat: number = detail.reservedSeats.length;
    const seatFare: number = detail.reservedSeats.reduce(
        (sum, seat) => sum + seat.seatFare,
        0,
    );
    return (
        <>
            <div className="justify-er flex flex-col items-start gap-4">
                <CustomModalTitle
                    title="予約キャンセル確認"
                    onRequestClose={onRequestClose}
                    isSubmitting={isSubmitting}
                />
                <div>以下の予約を取り消しますか？</div>

                <ReservationInfo detail={detail} id="reservationList" />
                <div className="flex w-full flex-col gap-2 rounded-lg bg-slate-50 p-3">
                    <div className="flex justify-between">
                        <span>チケット料金</span>
                        <span>￥{seatFare.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>手数料</span>
                        <span>
                            -￥
                            {(
                                countSeat * FARE_CONSTANTS.REFUND
                            ).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>払戻金額</span>{' '}
                        <span>
                            ￥
                            {(
                                seatFare -
                                countSeat * FARE_CONSTANTS.REFUND
                            ).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="flex w-full items-center justify-end gap-4">
                    <button
                        data-testid={'refund-confirm-button'}
                        onClick={() => onClick(detail.reservationId!)}
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
