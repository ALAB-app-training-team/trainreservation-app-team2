import { useState } from 'react';
import { toast } from 'sonner';

import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { LIMIT } from '@/shared/constants/Limit';

export function useSelectedSeats(initialSeats: SeatResponseDto[] = []) {
    const [selectedSeats, setSelectedSeats] =
        useState<SeatResponseDto[]>(initialSeats);

    const handleSelectedSeats = (seat: SeatResponseDto) => {
        if (selectedSeats.some(selectedSeat => selectedSeat.seatCd === seat.seatCd && selectedSeat.trainCarCd === seat.trainCarCd)) {
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

            toast.error(`${ERROR_MESSAGE.RELEASE_SEAT}\n` +
                reservedSeatsInSelectedSeats
                    .map(
                        (seat: SeatResponseDto) =>
                            '・' +
                            seat.trainCarNumber +
                            '号車' +
                            seat.seatNumber +
                            seat.seatColumn,
                    )
                    .join('\n'),{
                duration:Infinity,
                action: {
                    label: 'OK',
                    onClick: () => {}
                },
                classNames: {
                    title : 'text-left whitespace-pre-line',
                }
            });
        }
    };

    return {
        selectedSeats,
        handleSelectedSeats,
        handleClear,
        checkReservedSeats,
    };
}
