import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { PiTrainBold } from "react-icons/pi";
import type { SearchResponseDto } from "../types/SearchResponseDto";

type ScheduleItemProps = {
  schedule: SearchResponseDto;
  departure_station_cd: string;
  departure_station_name: string;
  arrival_station_cd: string;
  arrival_station_name: string;
};

export function ScheduleItem({
  schedule,
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

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const handleSearch = () => {
    navigate("/selectSeat");
    console.log(departure_station_cd, arrival_station_cd);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-start items-start md:items-center w-full p-8 border-2 rounded-2xl border-primary-light gap-4">
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
            <div className="text-2xl font-black">
              {formatTime(schedule.departure_time)}
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
              {formatTime(schedule.arrival_time)}
            </div>
            <div>{arrival_station_name}</div>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="p-2 rounded-lg bg-primary text-white"
          >
            詳細を見る
          </button>
        </div>
      </div>
    </>
  );
}
