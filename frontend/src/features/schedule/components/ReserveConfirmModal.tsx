import { FARE_CONSTANTS } from '@/features/reservation/constants/FareConstant';
import { UpdatedReservationInfo } from '@/features/schedule/components/UpdatedReservationInfo';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { TrainCarFormationResponseDto } from '@/features/schedule/types/TrainCarFormationResponseDto';
import { CustomModalTitle } from '@/shared/components/CustomModalTitle';

type FareBreakdownItem = {
    trainCarTypeCd: string;
    typeName: string;
    seatFare: number;
    count: number;
};

type ReserveConfirmModalProps = {
    onClick: () => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
    selectedSeats: SeatResponseDto[];
    scheduleInfo: ScheduleInfoDto;
    trainCars: TrainCarFormationResponseDto[];
};

export function ReserveConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
    selectedSeats,
    scheduleInfo,
    trainCars,
}: ReserveConfirmModalProps) {
    const trainCarTypeNameByCarCd = new Map(
        trainCars.map((car) => [car.trainCarCd, car.trainCarTypeName]),
    );

    const totalFare = selectedSeats.reduce(
        (accumulator, seat) => accumulator + seat.seatFare,
        0,
    );
    // 席種・単価ごとに枚数を集計する
    const breakdownByKey = selectedSeats.reduce<
        Record<string, FareBreakdownItem>
    >((accumulator, seat) => {
        const typeName =
            trainCarTypeNameByCarCd.get(seat.trainCarCd) ?? seat.trainCarTypeCd;
        const key = `${seat.trainCarTypeCd}-${seat.seatFare}`;
        accumulator[key] ??= {
            trainCarTypeCd: seat.trainCarTypeCd,
            typeName,
            seatFare: seat.seatFare,
            count: 0,
        };
        accumulator[key].count += 1;
        return accumulator;
    }, {});
    // 席種コード順 (CAR01 → CAR03) = 指定席 → グリーン車 → グランクラス
    const fareBreakdown = Object.values(breakdownByKey).sort((a, b) =>
        a.trainCarTypeCd.localeCompare(b.trainCarTypeCd),
    );

    return (
        <>
            <div className="flex flex-col items-start justify-center gap-1 pb-2">
                <CustomModalTitle
                    title="予約確認"
                    onRequestClose={onRequestClose}
                    isSubmitting={isSubmitting}
                />
                <div>予約を確定しますか？</div>
            </div>
            <UpdatedReservationInfo
                detail={scheduleInfo}
                showTotalFare={false}
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
            <div className="bg-surface-subtle mt-3.5 flex flex-col gap-1 rounded-lg px-4 py-2.5">
                {fareBreakdown.map((item) => (
                    <div
                        key={`${item.typeName}-${item.seatFare}`}
                        className="text-fg-secondary flex items-center justify-between text-sm"
                    >
                        <span>
                            {item.typeName}
                            <span className="ml-2">
                                ￥{item.seatFare.toLocaleString()} ×{' '}
                                {item.count}
                            </span>
                        </span>
                        <span>
                            ￥{(item.seatFare * item.count).toLocaleString()}
                        </span>
                    </div>
                ))}
                <div className="border-line mt-1 flex items-center justify-between border-t pt-2">
                    <span className="text-fg-muted text-sm">お支払い合計</span>
                    <span className="text-lg font-bold">
                        ￥{totalFare.toLocaleString()}
                    </span>
                </div>
            </div>
            <div className="text-fg-muted mt-2 text-sm">
                ※予約の取り消しには手数料が発生します (1座席につき{' '}
                {FARE_CONSTANTS.REFUND}円)
            </div>
            <div className="flex w-full items-center justify-end gap-4 p-2">
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
                    予約を確定する
                </button>
            </div>
        </>
    );
}
