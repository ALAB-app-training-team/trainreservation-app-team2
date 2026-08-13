import { FiArrowRight } from 'react-icons/fi';

import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

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
        scheduleInfo.scheduleCd !== preChangeScheduleInfo?.scheduleCd;
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
                        {isScheduleChanged ? (
                            <div className="flex flex-col">
                                <div className="border-primary-light mb-2 rounded-2xl border-2 p-2">
                                    <div className="bg-primary-light flex items-center justify-between gap-4 rounded-3xl px-2 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="text-lg text-gray-900">
                                                {scheduleInfo.trainTypeName}
                                            </div>
                                        </div>
                                        <div className="rounded-full border border-gray-100 bg-white px-2 py-1 text-base font-bold text-gray-900">
                                            {scheduleInfo.date?.replace(
                                                /-/g,
                                                '/',
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-2 py-2">
                                        <div className="flex flex-col">
                                            <div className="text-2xl font-black text-gray-900">
                                                {scheduleInfo.departureTime?.slice(
                                                    0,
                                                    5,
                                                )}
                                            </div>
                                            <div className="mt-0.5 text-lg">
                                                {
                                                    scheduleInfo.departureStationName
                                                }
                                            </div>
                                        </div>
                                        <div className="text-primary flex h-6 w-6 items-center justify-center">
                                            <FiArrowRight className="text-primary text-2xl" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-2xl font-black text-gray-900">
                                                {scheduleInfo.arrivalTime?.slice(
                                                    0,
                                                    5,
                                                )}
                                            </div>
                                            <div className="mt-0.5 text-lg">
                                                {
                                                    scheduleInfo.arrivalStationName
                                                }
                                            </div>
                                        </div>
                                    </div>
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
