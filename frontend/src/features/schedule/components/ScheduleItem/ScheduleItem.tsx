import type { SearchResponseDto } from "../../types/SearchResponseDto";

type ScheduleItemProps = { suchedule: SearchResponseDto };

export function ScheduleItem({ suchedule }: ScheduleItemProps) {
  return (
    <>
      <div>{suchedule.train_type_name}</div>
      <div>{suchedule.departure_station_name}</div>
      <div>{suchedule.departure_time}</div>
      <div>{suchedule.arrival_station_name}</div>
      <div>{suchedule.arrival_time}</div>
    </>
  );
}
