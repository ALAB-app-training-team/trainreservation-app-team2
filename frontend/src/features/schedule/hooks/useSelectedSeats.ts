import { useEffect, useState } from "react";

export function useSelectedSeats() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSelectedSeats = (seatCd: string) => {
    if (selectedSeats.includes(seatCd)) {
      setSelectedSeats((prevSeats) =>
        prevSeats.filter((selectedSeatCds) => selectedSeatCds !== seatCd),
      );
    } else {
      setSelectedSeats((prevSeats) => [...prevSeats, seatCd]);
    }
  };

  return { selectedSeats, handleSelectedSeats };
}
