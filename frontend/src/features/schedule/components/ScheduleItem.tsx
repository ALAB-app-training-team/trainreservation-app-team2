import { FiArrowRight } from 'react-icons/fi';
import { PiTrainBold } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { tv } from 'tailwind-variants';

import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { SearchResponseDto } from '@/features/schedule/types/SearchResponseDto';
import { TRAIN_TYPE_COLOR } from '@/shared/constants/TrainTypeColor';
import { FormatTime } from '@/shared/utils/FormatTime';

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
        };
        navigate('/selectSeat', {
            state: {
                scheduleInfoDto,
                departureStationCd,
                arrivalStationCd,
                searchRequestDto,
            },
        });
        window.scrollTo(0, 0);
    };

    const trainIconStyle = tv({
        base: 'flex justify-center items-center w-8 h-8 p-0.5 text-2xl rounded-md text-white',
        variants: {
            color: {
                primary: 'bg-primary',
                YM: 'bg-YM',
                HB: 'bg-HB',
                NS: 'bg-NS',
                HT: 'bg-HT',
                KM: 'bg-KM',
                TB: 'bg-TB',
                TK: 'bg-TK',
                TN: 'bg-TN',
                KK: 'bg-KK',
                AS: 'bg-AS',
            },
        },
        defaultVariants: {
            color: 'primary',
        },
    });

    const foundColor = TRAIN_TYPE_COLOR.find(
        (item) =>
            item.trainTypeName === schedule.trainTypeName.split(/(\d+)/)[0],
    );

    const colorCd = foundColor ? foundColor.colorCd : 'primary';

    return (
        <>
            <div className="border-primary-light flex w-full flex-row flex-wrap items-center justify-start gap-4 rounded-2xl border-2 p-8 md:items-center">
                <div className="order-1 flex flex-1 gap-4 md:flex-none">
                    <div className="flex items-center">
                        <div className={trainIconStyle({ color: colorCd })}>
                            <PiTrainBold />
                        </div>
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
                        <div className="text-2xl font-black">
                            {FormatTime(schedule.departureTime)}
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
                        <div className="text-2xl font-black">
                            {FormatTime(schedule.arrivalTime)}
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
        </>
    );
}
