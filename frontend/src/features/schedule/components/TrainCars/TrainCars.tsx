import { Suspense } from "react";
import type { SeatsRequestDto } from "../../types/SeatsRequestDto";
import type { SeatResponseDto } from "../../types/SeatResponseDto";
import type { TrainCarRequestDto } from "../../types/TrainCarRequestDto";
import { SeatsByTrainCar } from "../SeatsByTrainCar/SeatsByTrainCar";
import { SeatsByTrainCarSkeleton } from "../SeatsByTrainCar/SeatsByTrainCarSkeleton";

type TrainCarsProps = {
  trainCarRequestDto: TrainCarRequestDto;
  selectedSeats: SeatResponseDto[];
  handleSelectedSeats: (seat: SeatResponseDto) => void;
};

export function TrainCars({
  trainCarRequestDto,
  selectedSeats,
  handleSelectedSeats,
}: TrainCarsProps) {
  // TODO: train_car_cdを動的にする
  const seatsRequestDto: SeatsRequestDto = {
    schedule_cd: trainCarRequestDto.schedule_cd,
    date: trainCarRequestDto.date,
    departure_station_cd: trainCarRequestDto.departure_station_cd,
    arrival_station_cd: trainCarRequestDto.arrival_station_cd,
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
