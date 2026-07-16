import { useState } from 'react';

import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

export function useSelectedSeats() {
    const [selectedSeats, setSelectedSeats] = useState<SeatResponseDto[]>([]);
    const limitSeats = 6;

    const handleSelectedSeats = (seat: SeatResponseDto) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats((prevSeats) =>
                prevSeats.filter(
                    (selectedSeat) =>
                        selectedSeat.trainCarCd + selectedSeat.seatCd !==
                        seat.trainCarCd + seat.seatCd,
                ),
            );
        } else if (selectedSeats.length < limitSeats) {
            setSelectedSeats((prevSeats) => [...prevSeats, seat]);
        }
    };

    const handleClear = () => {
        setSelectedSeats([]);
    };

    const checkReservedSeats = (seats: SeatResponseDto[]) => {
        const reservedSeatCds = new Set(
            seats
                .filter((seat) => seat.isReserved)
                .map((seat) => seat.trainCarCd + seat.seatCd),
        );
        const reservedSeatsInSelectedSeats: SeatResponseDto[] =
            selectedSeats.filter((selectedSeat) =>
                reservedSeatCds.has(
                    selectedSeat.trainCarCd + selectedSeat.seatCd,
                ),
            );
        if (reservedSeatsInSelectedSeats.length > 0) {
            setSelectedSeats((prevSeats) =>
                prevSeats.filter(
                    (selectedSeat) =>
                        !reservedSeatCds.has(
                            selectedSeat.trainCarCd + selectedSeat.seatCd,
                        ),
                ),
            );
            alert(
                '選択中の座席が予約されたため、以下の座席の選択を解除しました。' +
                    reservedSeatsInSelectedSeats
                        .map(
                            (seat: SeatResponseDto) =>
                                seat.trainCarNumber +
                                '号車' +
                                seat.seatNumber +
                                seat.seatColumn,
                        )
                        .join(','),
            );
        }
    };

    return {
        selectedSeats,
        limitSeats,
        handleSelectedSeats,
        handleClear,
        checkReservedSeats,
    };
}
