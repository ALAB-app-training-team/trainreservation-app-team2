import { Suspense, useMemo, useState } from "react";
import { useTrainCar } from "../../hooks/useTrainCar";
import type { SeatsRequestDto } from "../../types/SeatsRequestDto";
import type { SeatResponseDto } from "../../types/SeatResponseDto";
import type { ScheduleInfoDto } from "../../types/ScheduleInfoDto";
import { SeatsByTrainCar } from "../SeatsByTrainCar/SeatsByTrainCar";
import { SeatsByTrainCarSkeleton } from "../SeatsByTrainCar/SeatsByTrainCarSkeleton";

type TrainCarsProps = {
  scheduleInfoDto: ScheduleInfoDto;
  selectedSeats: SeatResponseDto[];
  handleSelectedSeats: (seat: SeatResponseDto) => void;
};

const SEAT_TYPE_LABELS = {
  SEAT01: "指定席",
  SEAT02: "グリーン車",
  SEAT03: "グランクラス",
} as const;

export function TrainCars({
  scheduleInfoDto,
  selectedSeats,
  handleSelectedSeats,
}: TrainCarsProps) {
  //const { trainCarsData } = useTrainCar(scheduleInfoDto.schedule_cd);
  const { trainCarsData } = useTrainCar("THK001");
  const [activeSeatTypeCd, setActiveSeatTypeCd] = useState<
    "SEAT01" | "SEAT02" | "SEAT03"
  >("SEAT01");
  const [activeTrainCarCd, setActiveTrainCarCd] = useState<string>("");

  const filteredCars = useMemo(() => {
    if (!trainCarsData) return [];
    return trainCarsData.filter((car) => car.seat_type_cd === activeSeatTypeCd);
  }, [trainCarsData, activeSeatTypeCd]);

  useMemo(() => {
    if (filteredCars.length > 0) {
      const isStillAvailable = filteredCars.some(
        (car) => car.train_car_cd === activeTrainCarCd,
      );
      if (!isStillAvailable) {
        setActiveTrainCarCd(filteredCars[0].train_car_cd);
      }
    }
  }, [filteredCars, activeTrainCarCd]);

  const seatsRequestDto: SeatsRequestDto = {
    schedule_cd: scheduleInfoDto.schedule_cd,
    date: scheduleInfoDto.date,
    departure_station_cd: scheduleInfoDto.departure_station_cd,
    arrival_station_cd: scheduleInfoDto.arrival_station_cd,
    train_car_cd: activeTrainCarCd,
  };

  return (
    <div className="p-8 border-2 border-primary-light rounded-3xl bg-white shadow-sm">
      <div className="flex bg-gray-100 p-1 rounded-full mb-8 space-x-1 max-w-md">
        {(
          Object.keys(SEAT_TYPE_LABELS) as Array<keyof typeof SEAT_TYPE_LABELS>
        ).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setActiveSeatTypeCd(code)}
            className={`flex-1 px-5 py-3text-center text-sm rounded-full font-medium transition-all duration-200 ${
              activeSeatTypeCd === code
                ? "bg-white text-gray-900 shadow-md font-semibold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {SEAT_TYPE_LABELS[code]}
          </button>
        ))}
      </div>

      <h2 className="text-base font-bold text-gray-950 mb-4">号車を選択</h2>

      <div className="flex space-x-3 overflow-x-auto pb-4 mb-8 scrollbar-thin">
        {filteredCars.map((car) => (
          <button
            key={car.train_car_number}
            type="button"
            onClick={() => setActiveTrainCarCd(car.train_car_cd)}
            className={`flex flex-col items-center justify-center min-w-[80px] h-20 p-3 border-2 rounded-2xl transition-all duration-200 ${
              activeTrainCarCd === car.train_car_cd
                ? "border-green-600 bg-green-50 text-green-700 font-bold shadow-sm"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className="text-sm">{car.train_car_number}号車</span>
            <span
              className={`text-[10px] mt-1 font-normal ${
                activeTrainCarCd === car.train_car_cd
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {car.availableSeats}席
            </span>
          </button>
        ))}

        {filteredCars.length === 0 && (
          <p className="text-sm text-gray-400 py-4 pl-2">
            該当する列車がありません
          </p>
        )}
      </div>

      <Suspense fallback={<SeatsByTrainCarSkeleton />}>
        <SeatsByTrainCar
          seatsRequestDto={seatsRequestDto}
          selectedSeats={selectedSeats}
          handleSelectedSeats={handleSelectedSeats}
        />
      </Suspense>
    </div>
  );
}
