import { useSeatsByTrainCar } from "../../hooks/useSeatsByTrainCar";

export function SeatsByTrainCar() {
  // TODO: 引数を動的にする
  const { seats } = useSeatsByTrainCar("E5SER01");

  return (
    <>
      <div className="flex flex-col justify-center items-start w-full gap-4">
        <h1 className="text-left !text-xl !m-0">
          {seats[0].train_car_number}号車
        </h1>
      </div>
    </>
  );
}
