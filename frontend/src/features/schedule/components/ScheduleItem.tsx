import { PiTrainBold } from "react-icons/pi";
import type { SearchResponseDto } from "../types/SearchResponseDto";

type ScheduleItemProps = {
  schedule: SearchResponseDto;
  departure_station_name: string;
  arrival_station_name: string;
};

export function ScheduleItem({
  schedule,
  departure_station_name,
  arrival_station_name,
}: ScheduleItemProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-start items-start md:items-center w-full p-8 border-2 rounded-2xl border-primary-transparent gap-4">
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
        </div>
        <div className="flex w-full justify-between items-center gap-4 flex-1">
          <div className="text-left">
            <div className="text-2xl font-black">{schedule.departure_time}</div>
            <div>{departure_station_name}</div>
          </div>
          <div className="flex-1 h-0.5 bg-primary-transparent" />
          <div className="text-left">
            <div className="text-2xl font-black">{schedule.arrival_time}</div>
            <div>{arrival_station_name}</div>
          </div>
        </div>
      </div>
    </>
  );
}
