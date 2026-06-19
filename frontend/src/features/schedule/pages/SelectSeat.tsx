import { Suspense } from "react";
import { useSelectedSeats } from "../hooks/useSelectedSeats";
import { TrainCarsSkeleton } from "../components/TrainCars/TrainCarsSkeleton";
import { TrainCars } from "../components/TrainCars/TrainCars";

export function SelectSeat() {
  const { selectedSeats, handleSelectedSeats } = useSelectedSeats();
  const mockScheduleCd = "E5SER01";

  return (
    <>
      <div className="p-4">
        {/* TODO: 戻るボタンを作る */}
        <Suspense fallback={<TrainCarsSkeleton />}>
          <TrainCars
            mockScheduleCd={mockScheduleCd}
            selectedSeats={selectedSeats}
            handleSelectedSeats={handleSelectedSeats}
          />
        </Suspense>
        {/* TODO: 選択した座席を一覧にするコンポーネントを作る */}
      </div>
    </>
  );
}
