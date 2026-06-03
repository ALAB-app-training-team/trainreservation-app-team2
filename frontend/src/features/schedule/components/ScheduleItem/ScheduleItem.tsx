import type { SearchResponseDto } from "../../types/SearchResponseDto";

type ScheduleItemProps = { suchedule: SearchResponseDto };

export function ScheduleItem({ suchedule }: ScheduleItemProps) {
  return (
    <>
      <div className="flex justify-between w-full p-8 border-2 rounded-2xl border-primary-transparent">
        <div className="flex justify-center gap-4">
          {(() => {
            const trainTypeName = suchedule.train_type_name.split(/(\d+)/);
            return (
              <div className="text-left">
                <div>{trainTypeName[0]}</div>
                <div>{trainTypeName[1]}{trainTypeName[2]}</div>
              </div>
            );
          })()}
          <div>
            <div>{suchedule.departure_time}</div>
            <div>{suchedule.departure_station_name}</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div>
            <div>{suchedule.arrival_time}</div>
            <div>{suchedule.arrival_station_name}</div>
          </div>
        </div>
      </div>
    </>
  );
}
