import { useState } from "react";
import type { SeatResponseDto } from "../types/SeatResponseDto";

export function useSelectedSeats() {
  const [selectedSeats, setSelectedSeats] = useState<SeatResponseDto[]>([]);
  const limitSeats = 6;

  const handleSelectedSeats = (seat: SeatResponseDto) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats((prevSeats) =>
        prevSeats.filter(
          (selectedSeatCds) => selectedSeatCds.seat_cd !== seat.seat_cd,
        ),
      );
    } else if (selectedSeats.length < limitSeats) {
      setSelectedSeats((prevSeats) => [...prevSeats, seat]);
    }
  };

  return { selectedSeats, limitSeats, handleSelectedSeats };
}
