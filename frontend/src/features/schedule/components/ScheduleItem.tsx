import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { PiTrainBold } from "react-icons/pi";
import { tv } from "tailwind-variants";
import { TrainTypeColor } from "../../../shared/types/TrainTypeColor.ts";
import { FormatTime } from "../../../shared/hooks/useFormatTime.ts";
import type { SearchResponseDto } from "../types/SearchResponseDto";
import type { ScheduleInfoDto } from "../types/ScheduleInfoDto";

type ScheduleItemProps = {
  schedule: SearchResponseDto;
  date: string;
  departure_station_cd: string;
  departure_station_name: string;
  arrival_station_cd: string;
  arrival_station_name: string;
};

export function ScheduleItem({
  schedule,
  date,
  departure_station_cd,
  departure_station_name,
  arrival_station_cd,
  arrival_station_name,
}: ScheduleItemProps) {
  const navigate = useNavigate();

  const calculateDuration = (
    departureTime: string,
    arrivalTime: string,
  ): string => {
    const [depHours, depMinutes] = (departureTime || "0:0")
      .split(":")
      .map(Number);
    const [arrHours, arrMinutes] = (arrivalTime || "0:0")
      .split(":")
      .map(Number);

    const totalMinutes =
      arrHours * 60 + arrMinutes - (depHours * 60 + depMinutes);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h${String(minutes).padStart(2, "0")}m`;
  };

  const handleSearch = () => {
    const scheduleInfoDto: ScheduleInfoDto = {
      schedule_cd: schedule.schedule_cd,
      date: date,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
    };
    navigate("/selectSeat", {
      state: { scheduleInfoDto, departure_station_cd, arrival_station_cd },
    });
  };

  const trainIconStyle = tv({
    base: "flex justify-center items-center w-8 h-8 p-0.5 text-2xl rounded-md text-white",
    variants: {
      color: {
        primary: "bg-primary",
        YM: "bg-YM",
        HB: "bg-HB",
        NS: "bg-NS",
        HT: "bg-HT",
        KM: "bg-KM",
        TB: "bg-TB",
        TK: "bg-TK",
        TN: "bg-TN",
        KK: "bg-KK",
        AS: "bg-AS",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  });

  const foundColor = TrainTypeColor.find(
    (item) =>
      item.train_type_name === schedule.train_type_name.split(/(\d+)/)[0],
  );

  const colorCd = foundColor ? foundColor.color_cd : "primary";

  return (
    <>
      <div className="flex flex-row flex-wrap justify-start items-center md:items-center w-full p-8 border-2 rounded-2xl border-primary-light gap-4">
        <div className="order-1 flex-1 md:flex-none flex gap-4">
          <div className="flex items-center">
            <div className={trainIconStyle({ color: colorCd })}>
              <PiTrainBold />
            </div>
          </div>
          {(() => {
            const trainTypeName = schedule.train_type_name.split(/(\d+)/);
            return (
              <div className="text-left w-16">
                <div className="text-lg font-extrabold">{trainTypeName[0]}</div>
                <div className="text-base">
                  {trainTypeName[1]}
                  {trainTypeName[2]}
                </div>
              </div>
            );
          })()}
        </div>
        <div className="order-3 md:order-2 flex w-full md:flex-1 justify-between items-center gap-4">
          <div className="text-left">
            <div className="text-2xl font-black">
              {FormatTime(schedule.departure_time)}
            </div>
            <div>{departure_station_name}</div>
          </div>
          <div className="flex-1 flex items-center gap-2 text-primary">
            <div className="relative w-full border-t-4 border-dotted border-primary-light">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                {calculateDuration(
                  schedule.departure_time,
                  schedule.arrival_time,
                )}
              </span>
            </div>
            <div className="text-2xl">
              <FiArrowRight />
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-black">
              {FormatTime(schedule.arrival_time)}
            </div>
            <div>{arrival_station_name}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="order-2 md:order-3 p-2 rounded-lg bg-primary text-white"
        >
          詳細を見る
        </button>
      </div>
    </>
  );
}
