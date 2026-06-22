import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import { SelectedSeats } from "../components/SelectedSeats";
import { TrainCars } from "../components/TrainCars/TrainCars";
import { TrainCarsSkeleton } from "../components/TrainCars/TrainCarsSkeleton";
import { useSelectedSeats } from "../hooks/useSelectedSeats";

export function SelectSeat() {
  const location = useLocation();
  const { scheduleInfoDto } = location.state;
  const { selectedSeats, handleSelectedSeats } = useSelectedSeats();

  return (
    <>
      <div className="flex flex-col md:flex-row flex-col-reverse justify-between items-start gap-4 w-full p-4">
        {/* TODO: 戻るボタンを作る */}
        <div className="w-full md:w-7/10">
          <Suspense fallback={<TrainCarsSkeleton />}>
            <TrainCars
              scheduleInfoDto={scheduleInfoDto}
              selectedSeats={selectedSeats}
              handleSelectedSeats={handleSelectedSeats}
            />
          </Suspense>
        </div>
        <div className="flex-1 w-full">
          <SelectedSeats selectedSeats={selectedSeats} />
        </div>
      </div>
    </>
  );
}
