import { FiArrowRight } from 'react-icons/fi';

import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import { TrainIcon } from '@/shared/components/TrainIcon';

type TrainInfoProps = {
    scheduleInfoDto: ScheduleInfoDto;
};

export function TrainInfo({ scheduleInfoDto }: TrainInfoProps) {
    if (!scheduleInfoDto) return null;

    return (
        <div className="border-primary-light mb-2 rounded-2xl border-2 p-2">
            <div className="bg-primary-light flex items-center justify-between gap-4 rounded-3xl px-5 py-2">
                <div className="flex items-center gap-2">
                    <TrainIcon trainTypeName={scheduleInfoDto.trainTypeName} />
                    <div className="text-lg text-gray-900">
                        {scheduleInfoDto.trainTypeName}
                    </div>
                </div>
                <div className="rounded-full border border-gray-100 bg-white px-3 py-1 text-base font-bold text-gray-900">
                    {scheduleInfoDto.date?.replace(/-/g, '/')}
                </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex flex-col">
                    <div className="text-2xl font-black text-gray-900">
                        {scheduleInfoDto.departureTime?.slice(0, 5)}
                    </div>
                    <div className="mt-0.5 text-lg">
                        {scheduleInfoDto.departureStationName}
                    </div>
                </div>
                <div className="text-primary flex h-6 w-6 items-center justify-center">
                    <FiArrowRight className="text-primary text-2xl" />
                </div>
                <div className="flex flex-col">
                    <div className="text-2xl font-black text-gray-900">
                        {scheduleInfoDto.arrivalTime?.slice(0, 5)}
                    </div>
                    <div className="mt-0.5 text-lg">
                        {scheduleInfoDto.arrivalStationName}
                    </div>
                </div>
            </div>
        </div>
    );
}
