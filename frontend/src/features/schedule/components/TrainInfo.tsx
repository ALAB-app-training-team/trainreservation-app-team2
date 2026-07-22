import { BsTrainFreightFrontFill } from 'react-icons/bs';
import { FaArrowRight } from 'react-icons/fa';

import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchResponseDto } from '@/features/schedule/types/SearchResponseDto';

type TrainInfoProps = {
    schedule: SearchResponseDto;
    scheduleInfoDto: ScheduleInfoDto;
    departureStationName?: string;
    arrivalStationName?: string;
};

export function TrainInfo({
    schedule,
    scheduleInfoDto,
    departureStationName,
    arrivalStationName,
}: TrainInfoProps) {
    if (!scheduleInfoDto) return null;

    return (
        <div className="mb-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="bg-primary-light flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-2">
                <div className="flex items-center gap-2">
                    <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-lg text-white shadow-sm">
                        <BsTrainFreightFrontFill className="text-lg" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                        {schedule?.trainTypeName}
                    </div>
                </div>
                <div className="rounded-full border border-gray-100 bg-white px-3 py-1 text-sm font-bold text-gray-500 shadow-sm">
                    {scheduleInfoDto.date?.replace(/-/g, '/')}
                </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex flex-col">
                    <div className="text-2xl font-black text-gray-900">
                        {scheduleInfoDto.departureTime?.slice(0, 5)}
                    </div>
                    <div className="mt-0.5 text-lg">{departureStationName}</div>
                </div>
                <div className="flex items-center justify-center px-4">
                    <div className="text-primary flex h-6 w-6 items-center justify-center">
                        <FaArrowRight className="text-primary text-xl" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="text-2xl font-black text-gray-900">
                        {scheduleInfoDto.arrivalTime?.slice(0, 5)}
                    </div>
                    <div className="mt-0.5 text-lg">{arrivalStationName}</div>
                </div>
            </div>
        </div>
    );
}
