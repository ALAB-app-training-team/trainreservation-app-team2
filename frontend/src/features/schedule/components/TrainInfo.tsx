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
    return (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4 text-gray-800">
                <div className="text-sm font-medium text-gray-500">
                    {scheduleInfoDto.date}
                </div>
                <div className="text-xl font-bold text-gray-900">
                    {schedule.trainTypeName}
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-baseline gap-2">
                    <div className="text-xl font-bold text-gray-900">
                        {departureStationName}
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                        {scheduleInfoDto.departureTime?.slice(0, 5)}
                    </div>
                </div>
                <div className="text-primary font-bold">→</div>
                <div className="flex items-baseline gap-2">
                    <div className="text-xl font-bold text-gray-900">
                        {arrivalStationName}
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                        {scheduleInfoDto.arrivalTime?.slice(0, 5)}
                    </div>
                </div>
            </div>
        </div>
    );
}
