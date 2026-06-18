import { Suspense } from "react";
import { SeatsByTrainCar } from "../SeatsByTrainCar/SeatsByTrainCar";
import { SeatsByTrainCarSkeleton } from "../SeatsByTrainCar/SeatsByTrainCarSkeleton";

type TrainCarsProps = {
  selectedSeats: string[];
  handleSelectedSeats: (id: string) => void;
};

export function TrainCars({
  selectedSeats,
  handleSelectedSeats,
}: TrainCarsProps) {
  return (
    <>
      <Suspense fallback={<SeatsByTrainCarSkeleton />}>
        <SeatsByTrainCar
          selectedSeats={selectedSeats}
          handleSelectedSeats={handleSelectedSeats}
        />
      </Suspense>
    </>
  );
}
