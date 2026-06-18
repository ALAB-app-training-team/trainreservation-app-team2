import { Suspense } from "react";
import { useSelectedSeats } from "../hooks/useSelectedSeats";
import { TrainCarsSkeleton } from "../components/TrainCars/TrainCarsSkeleton";
import { TrainCars } from "../components/TrainCars/TrainCars";

export function SelectSeat() {
  const { selectedSeats, handleSelectedSeats } = useSelectedSeats();

  return (
    <>
      <div className="p-4">
        {/* TODO: 戻るボタンを作る */}
        <Suspense fallback={<TrainCarsSkeleton />}>
          <TrainCars
            selectedSeats={selectedSeats}
            handleSelectedSeats={handleSelectedSeats}
          />
        </Suspense>
        {/* TODO: 選択した座席を一覧にするコンポーネントを作る */}
      </div>
    </>
  );
}
