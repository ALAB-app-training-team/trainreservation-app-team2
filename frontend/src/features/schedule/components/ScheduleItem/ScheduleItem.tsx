import { PiTrainBold } from "react-icons/pi";
import type { SearchResponseDto } from "../../types/SearchResponseDto";

type ScheduleItemProps = { schedule: SearchResponseDto };

export function ScheduleItem({ schedule: schedule }: ScheduleItemProps) {
  return (
    <>
      <div className="flex justify-between w-full p-8 border-2 rounded-2xl border-primary-transparent">
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="flex justify-center items-center w-8 h-8 p-0.5 text-2xl rounded-md bg-primary text-white">
              <PiTrainBold />
            </div>
          </div>
          {(() => {
            const trainTypeName = schedule.train_type_name.split(/(\d+)/);
            return (
              <div className="text-left">
                <div className="text-lg font-extrabold">{trainTypeName[0]}</div>
                <div className="text-base">
                  {trainTypeName[1]}
                  {trainTypeName[2]}
                </div>
              </div>
            );
          })()}
          <div className="text-left">
            <div className="text-2xl font-black">
              {schedule.departure_time}
            </div>
            <div>{schedule.departure_station_name}</div>
          </div>
        </div>
        <div className="text-left">
          <div className="text-2xl font-black">
            {schedule.arrival_time}
          </div>
          <div>{schedule.arrival_station_name}</div>
        </div>
      </div>
    </>
  );
}
