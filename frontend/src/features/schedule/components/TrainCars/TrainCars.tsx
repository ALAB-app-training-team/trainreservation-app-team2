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

  const [activeTrainCarCd, setActiveTrainCarCd] = useState<string>(() => {
    if (trainCarsData && trainCarsData.length > 0) {
      const initialCar = trainCarsData.find(
        (car) => car.seat_type_cd === "SEAT01",
      );
      return initialCar ? initialCar.train_car_cd : "E5SER01";
    }
    return "E5SER01";
  });

  const seatsRequestDto: SeatsRequestDto = {
    schedule_cd: scheduleInfoDto.schedule_cd,
    date: scheduleInfoDto.date,
    departure_time: scheduleInfoDto.departure_time,
    arrival_time: scheduleInfoDto.arrival_time,
    train_car_cd: activeTrainCarCd,
  };

  return (
    <div className=" flex flex-col gap-8 p-8 border-2 border-primary-light rounded-2xl">
      <div className="flex w-full bg-primary-light p-1 rounded-full">
        {(
          Object.keys(SEAT_TYPE_LABELS) as Array<keyof typeof SEAT_TYPE_LABELS>
        ).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setActiveSeatTypeCd(code)}
            className={`flex-1 px-4 py-2 text-center text-sm rounded-full transition-all duration-200 ${
              activeSeatTypeCd === code
                ? "cursor-default bg-white text-gray-900 shadow-md font-semibold"
                : "cursor-pointer hover:text-gray-900"
            }`}
          >
            {trainCarsData?.find(
              (car) => car.seat_type_cd.toUpperCase() === code.toUpperCase(),
            )?.train_car_type_name ||
              SEAT_TYPE_LABELS[code as keyof typeof SEAT_TYPE_LABELS]}
          </button>
        ))}
      </div>

      {filteredCars.length > 0 ? (
        <>
          <div>
            <div className="text-left mb-2">号車を選択</div>
            <div className="flex flex-wrap gap-2">
              {filteredCars.map((car) => (
                <button
                  key={car.train_car_number}
                  type="button"
                  onClick={() => setActiveTrainCarCd(car.train_car_cd)}
                  className={`flex flex-col items-center justify-center w-16 h-16 border-2 rounded-2xl transition-all duration-200 ${
                    activeTrainCarCd === car.train_car_cd
                      ? "border-primary bg-primary-light text-primary font-bold"
                      : "border-primary-light hover:bg-primary-lighty"
                  }`}
                >
                  <span className="font-bold">{car.train_car_number}</span>
                </button>
              ))}
            </div>
          </div>
          <Suspense fallback={<SeatsByTrainCarSkeleton />}>
            <SeatsByTrainCar
              seatsRequestDto={seatsRequestDto}
              selectedSeats={selectedSeats}
              handleSelectedSeats={handleSelectedSeats}
            />
          </Suspense>
        </>
      ) : (
        <div>該当する列車がありません</div>
      )}
    </div>
  );
}
