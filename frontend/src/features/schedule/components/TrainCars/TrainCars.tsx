import { Suspense, useMemo, useState } from "react";
import { SeatsByTrainCar } from "../SeatsByTrainCar/SeatsByTrainCar";
import { SeatsByTrainCarSkeleton } from "../SeatsByTrainCar/SeatsByTrainCarSkeleton";

interface TrainCarsProps {
  mockScheduleCd: string;
  selectedSeats: string[];
  handleSelectedSeats: (id: string) => void;
}


export function TrainCars({
  mockScheduleCd,
  selectedSeats,
  handleSelectedSeats,
}: TrainCarsProps) {
  const { trainCarsData } = useTrainCar(mockScheduleCd);

  const [activeSeatType, setActiveSeatType] = useState<
    "指定席" | "グリーン車" | "グランクラス"
  >("指定席");

  const [activeTrainCarCd, setActiveTrainCarCd] = useState<string>("");

  const filteredCars = useMemo(() => {
    if (!trainCarsData) return [];
    return trainCarsData.filter((car) => car.seatType === activeSeatType);
  }, [trainCarsData, activeSeatType]);

  useMemo(() => {
    if(filteredCars.length > 0){
      const isStillAvailable =filteredCars.some(car => car.trainCarCd === activeTrainCarCd);
      if(!isStillAvailable){
        setActiveTrainCarCd(filteredCars[0].trainCarCd);
      }
    }
  }, [filteredCars, activeTrainCarCd]);

  return (
    <div className="p-8 border border-gray-200 rounded-3xl bg-white shadow-sm">
      <div className="flex bg-gray-100 p-1 rounded-full mb-8 space-x-1 max-w-md">
        {(["指定席", "グリーン車", "グランクラス"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveSeatType(type)}
            className={`flex-1 text-center ${
              activeSeatType === type
                ? "bg-white text-gray-900 shadow-md font-semibold"
                : "text-gray-500 hover:text-gray-900"
            }`}
            >
            {type}
            </button>
        ))}
      </div>
    
      <h2 className="text-base font-bold text-gray-950 mb-4">号車を選択</h2>


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
