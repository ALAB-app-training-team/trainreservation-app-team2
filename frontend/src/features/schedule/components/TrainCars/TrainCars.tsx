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
      {/* TODO: このコンポーネントで号車や指定席・グリーン席等を選択できるようにする */}
      <div className="p-8 border-2 rounded-2xl border-primary-light">
        <Suspense fallback={<SeatsByTrainCarSkeleton />}>
          <SeatsByTrainCar
            selectedSeats={selectedSeats}
            handleSelectedSeats={handleSelectedSeats}
          />
        </Suspense>
      </div>
    </>
  );
}
