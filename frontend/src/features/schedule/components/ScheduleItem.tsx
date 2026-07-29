import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { SearchResponseDto } from '@/features/schedule/types/SearchResponseDto';
import { TrainIcon } from '@/shared/components/TrainIcon';

import { SEAT_TYPE_LABELS } from '../constants/SeatTypeLabel';

type ScheduleItemProps = {
    schedule: SearchResponseDto;
    date: string;
    departureStationCd: string;
    departureStationName: string;
    arrivalStationCd: string;
    arrivalStationName: string;
    searchRequestDto: SearchRequestDto;
};

export function ScheduleItem({
    schedule,
    date,
    departureStationCd,
    departureStationName,
    arrivalStationCd,
    arrivalStationName,
    searchRequestDto,
}: ScheduleItemProps) {
    const navigate = useNavigate();

    const calculateDuration = (
        departureTime: string,
        arrivalTime: string,
    ): string => {
        const [depHours, depMinutes] = (departureTime || '0:0')
            .split(':')
            .map(Number);
        const [arrHours, arrMinutes] = (arrivalTime || '0:0')
            .split(':')
            .map(Number);

        const totalMinutes =
            arrHours * 60 + arrMinutes - (depHours * 60 + depMinutes);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h${String(minutes).padStart(2, '0')}m`;
    };

    const handleSearch = () => {
        const scheduleInfoDto: ScheduleInfoDto = {
            scheduleCd: schedule.scheduleCd,
            date: date,
            departureTime: schedule.departureTime,
            arrivalTime: schedule.arrivalTime,
            trainTypeName: schedule.trainTypeName,
            departureStationCd,
            arrivalStationCd,
            departureStationName,
            arrivalStationName,
        };
        navigate('/selectSeat', {
            state: {
                scheduleInfoDto,
                searchRequestDto,
            },
        });
        window.scrollTo(0, 0);
    };

    dayjs.extend(customParseFormat);

    const seatList = [
        { label: SEAT_TYPE_LABELS.SEAT01, count: schedule.reservedSeats },
        { label: SEAT_TYPE_LABELS.SEAT02, count: schedule.greenSeats },
        { label: SEAT_TYPE_LABELS.SEAT03, count: schedule.gcSeats },
    ];

    return (
        <>
            <div
                data-testid="schedule"
                className="border-primary-light rounded-2xl border-2 p-8"
            >
                <div className="flex w-full flex-row flex-wrap items-center justify-start gap-4 md:items-center">
                    <div
                        data-testid="schedule-train"
                        className="order-1 flex flex-1 gap-4 md:flex-none"
                    >
                        <div className="flex items-center">
                            <TrainIcon trainTypeName={schedule.trainTypeName} />
                        </div>
                        {(() => {
                            const trainTypeName =
                                schedule.trainTypeName.split(/(\d+)/);
                            return (
                                <div className="w-16 text-left">
                                    <div className="text-lg font-extrabold">
                                        {trainTypeName[0]}
                                    </div>
                                    <div className="text-base">
                                        {trainTypeName[1]}
                                        {trainTypeName[2]}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                    <div className="order-3 flex w-full items-center justify-between gap-4 md:order-2 md:flex-1">
                        <div className="text-left">
                            <div
                                data-testid="schedule-departure-time"
                                className="text-2xl font-black"
                            >
                                {dayjs(
                                    schedule.departureTime,
                                    'HH:mm:ss',
                                ).format('HH:mm')}
                            </div>
                            <div>{departureStationName}</div>
                        </div>
                        <div className="text-primary flex flex-1 items-center gap-2">
                            <div className="border-primary-light relative w-full border-t-4 border-dotted">
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                    {calculateDuration(
                                        schedule.departureTime,
                                        schedule.arrivalTime,
                                    )}
                                </span>
                            </div>
                            <div className="text-2xl">
                                <FiArrowRight />
                            </div>
                        </div>
                        <div className="text-left">
                            <div
                                data-testid="schedule-arrival-time"
                                className="text-2xl font-black"
                            >
                                {dayjs(schedule.arrivalTime, 'HH:mm:ss').format(
                                    'HH:mm',
                                )}
                            </div>
                            <div>{arrivalStationName}</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="bg-primary order-2 rounded-lg p-2 text-white md:order-3"
                    >
                        詳細を見る
                    </button>
                </div>
                <div>
                    {seatList.map((seat) => (
                        <div key={seat.label}>
                            {seat.label}
                            {seat.count}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
