import { useState } from 'react';

import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

export function useSelectedSeats() {
    const [selectedSeats, setSelectedSeats] = useState<SeatResponseDto[]>([]);
    const limitSeats = 6;

    const handleSelectedSeats = (seat: SeatResponseDto) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats((prevSeats) =>
                prevSeats.filter(
                    (selectedSeatCds) => selectedSeatCds.seatCd !== seat.seatCd,
                ),
            );
        } else if (selectedSeats.length < limitSeats) {
            setSelectedSeats((prevSeats) => [...prevSeats, seat]);
        }
    };

    return { selectedSeats, limitSeats, handleSelectedSeats };
}
