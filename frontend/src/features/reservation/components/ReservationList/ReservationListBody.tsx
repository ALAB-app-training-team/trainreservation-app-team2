import { useState } from "react";
/*import useSWR from "swr";*/
import { CiCalendar } from "react-icons/ci";
import { RiGroupLine } from "react-icons/ri";

/*import { ENDPOINTS } from "../../../../api/routes";
import fetcher from "../../../../api/fetcher";
import { Error } from "../../../../shared/pages/Error";*/

import { ReservationSelectItem } from "./ReservationSelectItem";

import type { ReservationListResponseDto } from "../../types/ReservationListResponseDto";

export function ReservationListBody() {
  const [selectedTab, setSelectedTab] = useState<"active" | "past">("active");

  /*const { data: reservations, error: reservationError } = useSWR<
    ReservationListResponseDto[]
  >(ENDPOINTS.RESERVATION(), fetcher);*/

  const reservations: ReservationListResponseDto[] = [
    {
      train_type_name: "やまびこ51号",
      departure_time: "06:00:00",
      departure_station_name: "東京",
      arrival_station_name: "仙台",
      ride_date: "2026-07-10",
      train_car_number: 1,
      seat_number: 1,
      seat_column: "A",
    },
    {
      train_type_name: "やまびこ51号",
      departure_time: "06:00:00",
      departure_station_name: "東京",
      arrival_station_name: "仙台",
      ride_date: "2026-07-10",
      train_car_number: 1,
      seat_number: 1,
      seat_column: "B",
    },
    {
      train_type_name: "やまびこ51号",
      departure_time: "06:00:00",
      departure_station_name: "東京",
      arrival_station_name: "仙台",
      ride_date: "2026-06-29",
      train_car_number: 1,
      seat_number: 1,
      seat_column: "A",
    },
  ];

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const activeReservations = reservations?.filter((reservation) => {
    const departureDate = new Date(reservation.ride_date);
    return departureDate >= now;
  });

  const pastReservations = reservations?.filter((reservation) => {
    const departureDate = new Date(reservation.ride_date);
    return departureDate < now;
  });

  const filteredReservations =
    selectedTab === "active" ? activeReservations : pastReservations;

  /*if (reservationError) {
    return <Error />;
  }*/

  return (
    <>
      <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
        <h1 className="text-left !text-3xl !m-0">予約確認</h1>
        <div className="bg-primary/8 flex gap-6 rounded-3xl p-2">
          <div className="flex w-full items-center">
            <button
              onClick={() => setSelectedTab("active")}
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                selectedTab === "active" ? "bg-white font-semibold shadow" : ""
              } `}
            >
              <CiCalendar />
              有効（{activeReservations?.length}）
            </button>
            <button
              onClick={() => setSelectedTab("past")}
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                selectedTab === "past" ? "bg-white font-semibold shadow" : ""
              } `}
            >
              <RiGroupLine />
              過去（{pastReservations?.length}）
            </button>
          </div>
        </div>
        {filteredReservations && filteredReservations.length > 0 ? (
          filteredReservations.map(
            (
              reservation: {
                train_car_number: number;
                seat_number: number;
                seat_column: string;
                train_type_name: string;
                departure_time: string;
                departure_station_name: string;
                arrival_station_name: string;
                ride_date: string;
              },
              index,
            ) => <ReservationSelectItem key={index} details={reservation} />,
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
