import { useSuspenseQuery } from '@tanstack/react-query';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import { FARE_CONSTANTS } from '@/features/reservation/constants/FareConstant';
import { UpdatedReservationInfo } from '@/features/schedule/components/UpdatedReservationInfo';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { TrainCarFormationResponseDto } from '@/features/schedule/types/TrainCarFormationResponseDto';
import { CustomModalTitle } from '@/shared/components/CustomModalTitle';

type ReserveConfirmModalProps = {
    onClick: () => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
    selectedSeats: SeatResponseDto[];
    scheduleInfo: ScheduleInfoDto;
};

export function ReserveConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
    selectedSeats,
    scheduleInfo,
}: ReserveConfirmModalProps) {
    const { data: trainCars } = useSuspenseQuery({
        queryKey: ['scheduleCd', scheduleInfo.scheduleCd],
        queryFn: async () => {
            const response = await apiClient.get<
                TrainCarFormationResponseDto[]
            >(ENDPOINTS.TRAINCAR(scheduleInfo.scheduleCd));
            return response.data;
        },
    });
    const trainCarTypeNameByCarCd = new Map(
        trainCars.map((car) => [car.trainCarCd, car.trainCarTypeName]),
    );

    const totalFare = selectedSeats.reduce(
        (accumulator, seat) => accumulator + seat.seatFare,
        0,
    );
    const fareBreakdown = Object.values(
        selectedSeats.reduce<
            Record<
                string,
                { typeName: string; seatFare: number; count: number }
            >
        >((accumulator, seat) => {
            const typeName =
                trainCarTypeNameByCarCd.get(seat.trainCarCd) ??
                seat.trainCarTypeCd;
            const key = `${typeName}-${seat.seatFare}`;
            accumulator[key] ??= {
                typeName,
                seatFare: seat.seatFare,
                count: 0,
            };
            accumulator[key].count += 1;
            return accumulator;
        }, {}),
    ).sort((a, b) => a.seatFare - b.seatFare);

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
            <div className="flex flex-col gap-2">
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
            </div>
            <div className="bg-surface-subtle mt-3.5 flex flex-col gap-1 rounded-lg px-4 py-2.5">
                {fareBreakdown.map((item) => (
                    <div
                        key={`${item.typeName}-${item.seatFare}`}
                        className="text-fg-secondary flex items-center justify-between text-sm"
                    >
                        <span>
                            {item.typeName}
                            <span className="ml-2 text-gray-500">
                                ￥{item.seatFare.toLocaleString()} ×{' '}
                                {item.count}
                            </span>
                        </span>
                        <span>
                            ￥{(item.seatFare * item.count).toLocaleString()}
                        </span>
                    </div>
                ))}
                <div className="mt-1 flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm text-gray-500">お支払い合計</span>
                    <span className="text-primary text-lg font-bold">
                        ￥{totalFare.toLocaleString()}
                    </span>
                </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
                ※予約の取り消しには手数料が発生します (1座席につき{' '}
                {FARE_CONSTANTS.REFUND}円)
            </p>
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
                    予約を確定する
                </button>
            </div>
        </>
    );
}
