import { Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../../../api/routes";
import { SelectedSeats } from "../components/SelectedSeats";
import { TrainCars } from "../components/TrainCars/TrainCars";
import { TrainCarsSkeleton } from "../components/TrainCars/TrainCarsSkeleton";
import { useSelectedSeats } from "../hooks/useSelectedSeats";
import type { ReserveRequestDto } from "../types/ReserveRequestDto";

export function SelectSeats() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scheduleInfoDto, departure_station_cd, arrival_station_cd } =
    location.state;
  const { selectedSeats, handleSelectedSeats } = useSelectedSeats();

  const handleReserve = async () => {
    console.log(scheduleInfoDto);

    // TODO: try-catchをつける
    const reserveRequestDto: ReserveRequestDto = {
      schedule_cd: scheduleInfoDto.schedule_cd,
      ride_date: scheduleInfoDto.date,
      departure_station_cd: departure_station_cd,
      arrival_station_cd: arrival_station_cd,
      seats: selectedSeats.map((seat) => ({
        train_car_cd: seat.train_car_cd,
        seat_cd: seat.seat_cd,
      })),
    };
    const response = await axios.post(ENDPOINTS.PURCHASE(), reserveRequestDto);
    console.log(response);
    navigate("/reservedTicket", {
      state: { purchaseId: response.data },
    });
  };

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
          <SelectedSeats
            selectedSeats={selectedSeats}
            onClick={handleReserve}
          />
        </div>
      </div>
    </>
  );
}
