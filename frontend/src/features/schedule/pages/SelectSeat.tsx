import { Suspense } from "react";
import { useSelectedSeats } from "../hooks/useSelectedSeats";
import { TrainCarsSkeleton } from "../components/TrainCars/TrainCarsSkeleton";
import { TrainCars } from "../components/TrainCars/TrainCars";

export function SelectSeat() {
  const { selectedSeats, handleSelectedSeats } = useSelectedSeats();

  return (
    <>
      <Suspense fallback={<TrainCarsSkeleton />}>
        <TrainCars
          selectedSeats={selectedSeats}
          handleSelectedSeats={handleSelectedSeats}
        />
      </Suspense>
    </>
  );
}
