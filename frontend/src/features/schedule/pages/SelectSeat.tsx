import { Suspense } from "react";
import { SeatsByTrainCar } from "../components/SeatsByTrainCar/SeatsByTrainCar";
import { SeatsByTrainCarSkeleton } from "../components/SeatsByTrainCar/SeatsByTrainCarSkeleton";

// 動作確認用page
export function SelectSeat() {
  return (
    <>
      <Suspense fallback={<SeatsByTrainCarSkeleton />}>
        <SeatsByTrainCar />
      </Suspense>
    </>
  );
}
