import { FaClock } from 'react-icons/fa';
import { LuTicket } from 'react-icons/lu';

import { DepartureAndArrivalInfo } from '@/features/reservation/components/DepartureAndArrivalInfo';
import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

type ReservedTicketInfoProps = {
    ticketInfo: ReservationResponseDto;
};

export function ReservedTicketInfo({ ticketInfo }: ReservedTicketInfoProps) {
    const totalFare = ticketInfo.reservedSeats.reduce(
        (sum, seat) => sum + (seat.seatFare || 0),
        0,
    );
    const formatter = new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    });
    return (
        <>
            <div className="flex w-full justify-center">
                <div className="flex w-full max-w-5xl flex-col gap-4">
                    <div className="border-primary-light flex flex-col justify-between gap-4 rounded-2xl border-2 p-4">
                        {ticketInfo.isDeleted && (
                            <div className="mt-2 flex items-center gap-2">
                                <LuTicket />
                                <label className="text-xl font-bold">
                                    {ticketInfo.trainTypeName}
                                </label>
                            </div>
                        )}
                        <div
                            data-testid="departure-arrival"
                            className="flex flex-row justify-between gap-4 md:items-center"
                        >
                            <DepartureAndArrivalInfo
                                id="departureInfo"
                                title="出発"
                                time={ticketInfo.departureTime}
                                station={ticketInfo.departureStationName}
                            />
                            <DepartureAndArrivalInfo
                                id="arrivalInfo"
                                title="到着"
                                time={ticketInfo.arrivalTime}
                                station={ticketInfo.arrivalStationName}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold">
                            <FaClock />
                            <div data-testid="ride-date">
                                {formatter.format(
                                    new Date(ticketInfo.rideDate),
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4 md:flex-row">
                            <ReservedSeats
                                id="reservationDetail"
                                title="座席"
                                seats={ticketInfo.reservedSeats}
                            />
                        </div>
                        <div className="border-primary-ink/20 flex items-baseline justify-between gap-2 border-t-2 pt-4">
                            <span>お支払い合計</span>
                            <span
                                data-testid="total-fare"
                                className="text-primary-ink text-xl font-bold tabular-nums"
                            >
                                ￥{totalFare.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
