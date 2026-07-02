import { useNavigate } from "react-router-dom";

import { LuTicket } from "react-icons/lu";
import { BsQrCode } from "react-icons/bs";
import { IoTrashOutline } from "react-icons/io5";

import type { ReservationListResponseDto } from "../../types/ReservationListResponseDto";

type ReservationSelectItemProps = {
  details: ReservationListResponseDto;
};

export function ReservationSelectItem({ details }: ReservationSelectItemProps) {
  const [year, month, day] = details.ride_date.split("-");
  const navigate = useNavigate();

  const departureDate = new Date(details.ride_date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <div className="border-primary/20 flex flex-col gap-4 rounded-2xl border p-8">
      <div className="flex-col">
        <div className="flex">
          <div className="flex grow-2 items-center gap-2 font-semibold">
            <LuTicket />
            <h3>{details.train_type_name}</h3>
          </div>
          {departureDate >= now && (
            <div className="bg-primary right-0 flex items-center justify-center rounded-xl px-3 text-sm text-white">
              有効
            </div>
          )}
        </div>
        <div className="flex py-2">
          <h5>
            {details.departure_station_name} → {details.arrival_station_name}
          </h5>
        </div>
      </div>
      <div className="flex">
        <div className="flex w-full flex-col items-start">
          <h5>出発</h5>
          <h3 className="font-semibold">
            {year}年{parseInt(month, 10)}月{parseInt(day, 10)}日{` `}
          </h3>
          <h3>{details.departure_time.slice(0, 5)}</h3>
        </div>
      </div>
      <div className="flex border-b-2 py-4 border-primary/20">
        <div className="flex flex-col gap-2 self-start items-start">
          <h5>座席</h5>
          <div className="border-primary/20 flex flex-none rounded-2xl border px-2 py-1 font-semibold">
            {details.train_car_number}号車 {details.seat_number}番
            {details.seat_column}席
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-sm text-primary">
          <IoTrashOutline />
          <h3>キャンセル</h3>
        </button>
        <button
          onClick={() =>
            navigate("/reservedTicket", { state: { reservation: details } })
          }
          className="bg-primary flex cursor-pointer items-center justify-center gap-4 rounded-md px-4 py-2 text-sm text-white"
        >
          <BsQrCode />
          <h3>チケットを表示</h3>
        </button>
      </div>
    </div>
  );
}
