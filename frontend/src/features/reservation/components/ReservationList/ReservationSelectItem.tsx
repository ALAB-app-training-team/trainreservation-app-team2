import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { BsQrCode } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { LuTicket } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

type ReservationSelectItemProps = {
    details: ReservationResponseDto;
};

export function ReservationSelectItem({ details }: ReservationSelectItemProps) {
    const navigate = useNavigate();

    const departureDate = new Date(details.rideDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const totalFare = details.reservedSeats.reduce(
        (sum, seat) => sum + (seat.seatFare || 0),
        0,
    );

    const handleReservationDetail = () => {
        navigate('/reservedTicket', {
            state: { purchaseId: details.purchaseId, isBack: true },
        });
        window.scrollTo(0, 0);
    };

    dayjs.extend(customParseFormat);

    return (
        <div className="border-primary-light flex flex-col gap-2 rounded-2xl border-2 p-8">
            <div className="flex-col">
                <div className="flex">
                    <div className="flex grow-2 items-center gap-2">
                        <LuTicket />
                        <label>{details.trainTypeName}</label>
                    </div>
                    {details.isDeleted ? (
                        <div className="text-primary border-primary right-0 flex items-center justify-center rounded-xl border-1 bg-white px-3 text-sm">
                            キャンセル
                        </div>
                    ) : departureDate >= now ? (
                        <div className="bg-primary right-0 flex items-center justify-center rounded-xl px-3 text-sm text-white">
                            有効
                        </div>
                    ) : (
                        <div className="text-primary right-0 flex items-center justify-center rounded-xl bg-green-100 px-3 text-sm">
                            完了
                        </div>
                    )}
                </div>
                <div className="flex py-2 text-xl font-bold">
                    <label>
                        {details.departureStationName} →{' '}
                        {details.arrivalStationName}
                    </label>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex w-full flex-col items-start">
                    <div className="flex grow-2 items-center gap-2">
                        <FaClock />
                        <label>出発</label>
                    </div>
                    <label
                        data-testid="ride-date"
                        className="text-xl font-bold"
                    >
                        {dayjs(details.rideDate).format('YYYY年MM月DD日')}{' '}
                    </label>
                    <label className="text-xl font-bold">
                        {dayjs(details.departureTime, 'HH:mm:ss').format(
                            'HH:mm',
                        )}
                    </label>
                </div>
            </div>
            <div className="border-primary/20 border-b-2 py-2">
                <ReservedSeats
                    id="reservationList"
                    title="座席"
                    seats={details.reservedSeats}
                />
            </div>
            <div className="flex items-center justify-between py-2">
                <div className="flex items-baseline">
                    <div>お支払い合計：</div>
                    <div
                        data-testid="total-fare"
                        className="text-primary text-xl font-bold"
                    >
                        ￥{totalFare.toLocaleString()}
                    </div>
                </div>
                {!details.isDeleted && departureDate >= now && (
                    <div className="flex justify-end">
                        <button className="text-primary flex items-center justify-center gap-2 rounded-xl px-3 text-sm">
                            <IoTrashOutline />
                            キャンセル
                        </button>
                        <button
                            onClick={handleReservationDetail}
                            className="bg-primary flex items-center justify-center gap-4 rounded-md px-4 py-2 text-sm text-white"
                        >
                            <BsQrCode />
                            チケットを表示
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
