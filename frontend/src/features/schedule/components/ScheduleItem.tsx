import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useNavigate } from 'react-router-dom';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { EmptySeatCount } from '@/features/schedule/components/EmptySeatCount';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { SearchResponseDto } from '@/features/schedule/types/SearchResponseDto';
import { TrainIcon } from '@/shared/components/TrainIcon';

type ScheduleItemProps = {
    schedule: SearchResponseDto;
    date: string;
    departureStationCd: string;
    departureStationName: string;
    arrivalStationCd: string;
    arrivalStationName: string;
    searchRequestDto: SearchRequestDto;
    reservationId: string | null;
    reservedSeats: ReservedSeatDto[];
    preChangeScheduleInfo: ScheduleInfoDto | null;
    isChanging: boolean | undefined;
    isBack: boolean | undefined;
};

export function ScheduleItem({
    schedule,
    date,
    departureStationCd,
    departureStationName,
    arrivalStationCd,
    arrivalStationName,
    searchRequestDto,
    reservationId,
    reservedSeats,
    preChangeScheduleInfo,
    isChanging,
    isBack,
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
            direction: schedule.direction,
        };
        const isScheduleCdUnchanged =
            preChangeScheduleInfo?.scheduleCd &&
            scheduleInfoDto.scheduleCd === preChangeScheduleInfo.scheduleCd &&
            scheduleInfoDto.date === preChangeScheduleInfo.date;

        navigate('/selectSeat', {
            state: {
                scheduleInfoDto,
                searchRequestDto,
                ...(reservationId && { reservationId }),
                isChanging,
                isBack,
                isFromReservedTicket: false,
                ...(preChangeScheduleInfo && { preChangeScheduleInfo }),
                ...(reservedSeats &&
                    reservedSeats.length > 0 && {
                        preChangeReservedSeats: reservedSeats,
                    }),
                ...(isScheduleCdUnchanged && { reservedSeats }),
            },
        });
        window.scrollTo(0, 0);
    };

    dayjs.extend(customParseFormat);

    return (
        <button
            type="button"
            onClick={handleSearch}
            data-testid="schedule"
            disabled={
                schedule.reservedSeats === 0 &&
                schedule.greenSeats === 0 &&
                schedule.gcSeats === 0
            }
            className="border-primary-light group enabled:hover:border-primary-ink flex w-full flex-col items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-200 ease-out sm:p-8 md:flex-row md:items-center md:justify-between"
        >
            <div className="flex items-center gap-2">
                <TrainIcon trainTypeName={schedule.trainTypeName} size="lg" />
                <div className="flex flex-col items-start gap-1">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                        <span
                            data-testid="schedule-departure-time"
                            className="text-heading text-2xl font-black tabular-nums"
                        >
                            {dayjs(schedule.departureTime, 'HH:mm:ss').format(
                                'HH:mm',
                            )}
                        </span>
                        <span className="text-heading text-2xl font-black">
                            -
                        </span>
                        <span
                            data-testid="schedule-arrival-time"
                            className="text-heading text-2xl font-black tabular-nums"
                        >
                            {dayjs(schedule.arrivalTime, 'HH:mm:ss').format(
                                'HH:mm',
                            )}
                        </span>
                        <span className="text-fg-muted text-sm">
                            (
                            {calculateDuration(
                                schedule.departureTime,
                                schedule.arrivalTime,
                            )}
                            )
                        </span>
                    </div>
                    <div
                        data-testid="schedule-train"
                        className="text-fg-secondary text-sm"
                    >
                        {schedule.trainTypeName}
                    </div>
                </div>
            </div>
            <EmptySeatCount
                reservedSeats={schedule.reservedSeats}
                greenSeats={schedule.greenSeats}
                gcSeats={schedule.gcSeats}
            />
        </button>
    );
}
