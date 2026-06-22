import { Suspense } from "react";
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

export function TrainCars({
  scheduleInfoDto,
  selectedSeats,
  handleSelectedSeats,
}: TrainCarsProps) {
  // TODO: train_car_cdを動的にする
  const seatsRequestDto: SeatsRequestDto = {
    schedule_cd: scheduleInfoDto.schedule_cd,
    date: scheduleInfoDto.date,
    departure_time: scheduleInfoDto.departure_time,
    arrival_time: scheduleInfoDto.arrival_time,
    train_car_cd: "E5SER01",
  };

  return (
    <>
      {/* TODO: このコンポーネントで号車や指定席・グリーン席等を選択できるようにする */}
      <div className="w-full p-8 border-2 rounded-2xl border-primary-light">
        <Suspense fallback={<SeatsByTrainCarSkeleton />}>
          <SeatsByTrainCar
            seatsRequestDto={seatsRequestDto}
            selectedSeats={selectedSeats}
            handleSelectedSeats={handleSelectedSeats}
          />
        </Suspense>
      </div>
    </>
  );
}
