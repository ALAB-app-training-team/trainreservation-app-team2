import { useState } from 'react';

import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

export function useSelectedSeats() {
    const [selectedSeats, setSelectedSeats] = useState<SeatResponseDto[]>([]);
    const limitSeats = 6;

    const handleSelectedSeats = (seat: SeatResponseDto) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats((prevSeats) =>
                prevSeats.filter(
                    (selectedSeat) => selectedSeat.seatCd !== seat.seatCd,
                ),
            );
        } else if (selectedSeats.length < limitSeats) {
            setSelectedSeats((prevSeats) => [...prevSeats, seat]);
        }
    };

    const handleClear = () => {
        setSelectedSeats([]);
    };

    return { selectedSeats, limitSeats, handleSelectedSeats, handleClear };
}
