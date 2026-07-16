import { useState } from 'react';

import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import { ALERT_MESSAGE } from '@/shared/constants/AlertMessages';
import { LIMIT } from '@/shared/constants/Limit';

export function useSelectedSeats() {
    const [selectedSeats, setSelectedSeats] = useState<SeatResponseDto[]>([]);

    const handleSelectedSeats = (seat: SeatResponseDto) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats((prevSeats) =>
                prevSeats.filter(
                    (selectedSeat) =>
                        selectedSeat.trainCarCd + selectedSeat.seatCd !==
                        seat.trainCarCd + seat.seatCd,
                ),
            );
        } else if (selectedSeats.length < LIMIT.SEATS) {
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
                `${ALERT_MESSAGE.RELEASE_SEAT}\n` +
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
        handleSelectedSeats,
        handleClear,
        checkReservedSeats,
    };
}
