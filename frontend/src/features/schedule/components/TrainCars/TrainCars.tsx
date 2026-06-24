import { Suspense, useMemo, useState } from "react";
import { useTrainCar } from "../../hooks/useTrainCar";
import type { SeatsRequestDto } from "../../types/SeatsRequestDto";
import type { SeatResponseDto } from "../../types/SeatResponseDto";
import type { ScheduleInfoDto } from "../../types/ScheduleInfoDto";
import { SeatsByTrainCar } from "../SeatsByTrainCar/SeatsByTrainCar";
import { SeatsByTrainCarSkeleton } from "../SeatsByTrainCar/SeatsByTrainCarSkeleton";
import { SEAT_TYPE_LABELS } from "../../constants/seatType";

type TrainCarsProps = {
  scheduleInfoDto: ScheduleInfoDto;
  selectedSeats: SeatResponseDto[];
  handleSelectedSeats: (seat: SeatResponseDto) => void;
};

export function TrainCars({
  scheduleInfoDto,
  selectedSeats,
  handleSelectedSeats,
}: TrainCarsProps) {
  const { trainCarsData } = useTrainCar(scheduleInfoDto.schedule_cd);

  const [activeSeatTypeCd, setActiveSeatTypeCd] = useState<
    "SEAT01" | "SEAT02" | "SEAT03"
  >("SEAT01");

  const filteredCars = useMemo(() => {
    if (!trainCarsData) return [];
    return trainCarsData.filter((car) => car.seat_type_cd === activeSeatTypeCd);
  }, [trainCarsData, activeSeatTypeCd]);

  const [userSelectedTrainCarCd, setUserSelectedTrainCarCd] =
    useState<string>("");

  const activeTrainCarCd = useMemo(() => {
    if (userSelectedTrainCarCd) {
      return userSelectedTrainCarCd;
    }
    if (filteredCars && filteredCars.length > 0) {
      return filteredCars[0].train_car_cd;
    }
    return "E5SER01";
  }, [userSelectedTrainCarCd, filteredCars]);

  const handleSeatTypeChange = (code: "SEAT01" | "SEAT02" | "SEAT03") => {
    setActiveSeatTypeCd(code);
    setUserSelectedTrainCarCd("");
  };

  const seatsRequestDto: SeatsRequestDto = {
    schedule_cd: scheduleInfoDto.schedule_cd,
    date: scheduleInfoDto.date,
    departure_time: scheduleInfoDto.departure_time,
    arrival_time: scheduleInfoDto.arrival_time,
    train_car_cd: activeTrainCarCd,
  };

  return (
    <div className="p-8 border-2 border-primary-light rounded-3xl bg-white shadow-sm">
      <div className="flex w-full bg-gray-100 p-1 rounded-full mb-8 space-x-1">
        {(
          Object.keys(SEAT_TYPE_LABELS) as Array<keyof typeof SEAT_TYPE_LABELS>
        ).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() =>
              handleSeatTypeChange(code as "SEAT01" | "SEAT02" | "SEAT03")
            }
            className={`flex-1 px-5 py-3 text-center text-sm rounded-full font-medium transition-all duration-200 ${
              activeSeatTypeCd === code
                ? "bg-white text-gray-900 shadow-md font-semibold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {trainCarsData?.find(
              (car) => car.seat_type_cd.toUpperCase() === code.toUpperCase(),
            )?.train_car_type_name ||
              SEAT_TYPE_LABELS[code as keyof typeof SEAT_TYPE_LABELS]}
          </button>
        ))}
      </div>

      <h4 className="w-full text-left text-base font-bold text-gray-900 mb-4">
        号車を選択
      </h4>

      <div className="flex space-x-3 overflow-x-auto pb-4 mb-8 scrollbar-thin">
        {filteredCars.map((car) => (
          <button
            key={car.train_car_number}
            type="button"
            onClick={() => setUserSelectedTrainCarCd(car.train_car_cd)}
            className={`flex flex-col items-center justify-center min-w-[80px] h-20 p-3 border-2 rounded-2xl transition-all duration-200 ${
              activeTrainCarCd === car.train_car_cd
                ? "border-primary bg-primary-light text-primary font-bold shadow-sm"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className="text-base font-bold">{car.train_car_number}</span>
          </button>
        ))}

        {filteredCars.length === 0 && (
          <p className="text-sm text-gray-400 py-4 pl-2">
            該当する列車がありません
          </p>
        )}
      </div>

      {filteredCars.length > 0 && (
        <Suspense fallback={<SeatsByTrainCarSkeleton />}>
          <SeatsByTrainCar
            seatsRequestDto={seatsRequestDto}
            selectedSeats={selectedSeats}
            handleSelectedSeats={handleSelectedSeats}
          />
        </Suspense>
      )}
    </div>
  );
}
