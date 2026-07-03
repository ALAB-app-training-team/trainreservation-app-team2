import { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { RiGroupLine } from 'react-icons/ri';
// import { useReservationList } from '@/features/reservation/hooks/useReservationList';
import { ReservationSelectItem } from '@/features/reservation/components/ReservationList/ReservationSelectItem';

import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function ReservationListBody() {
    const [selectedTab, setSelectedTab] = useState<'active' | 'past'>('active');
    // const { reservations } = useReservationList();

    const reservations: ReservationResponseDto[] = [
        {
            purchaseId: '521390fb-8077-4383-831d-9b321739ad11',
            trainTypeName: 'やまびこ51号',
            departureTime: '06:00:00',
            departureStationName: '東京',
            arrivalStationName: '仙台',
            rideDate: '2026-07-10',
            reservedSeats: [
                {
                    trainCarTypeName: '指定席',
                    trainCarNumber: 1,
                    seatNumber: 1,
                    seatColumn: 'A',
                    codeToken: '4d661a82-044b-45a7-8799-978b5a5e2a5f',
                },
                {
                    trainCarTypeName: '指定席',
                    trainCarNumber: 1,
                    seatNumber: 2,
                    seatColumn: 'B',
                    codeToken: 'ee38f696-a063-4bcd-a88a-00a9ff925fc2',
                },
                {
                    trainCarTypeName: '指定席',
                    trainCarNumber: 1,
                    seatNumber: 3,
                    seatColumn: 'C',
                    codeToken: 'bd07ab55-3fde-43a6-9073-0d334f4e1a3e',
                },
            ],
        },
        {
            purchaseId: '521390fb-8077-4383-831d-9b321739ad11',
            trainTypeName: 'やまびこ51号',
            departureTime: '06:00:00',
            departureStationName: '東京',
            arrivalStationName: '仙台',
            rideDate: '2026-07-02',
            reservedSeats: [
                {
                    trainCarTypeName: '指定席',
                    trainCarNumber: 1,
                    seatNumber: 1,
                    seatColumn: 'A',
                    codeToken: '4d661a82-044b-45a7-8799-978b5a5e2a5f',
                },
                {
                    trainCarTypeName: '指定席',
                    trainCarNumber: 1,
                    seatNumber: 2,
                    seatColumn: 'B',
                    codeToken: 'ee38f696-a063-4bcd-a88a-00a9ff925fc2',
                },
                {
                    trainCarTypeName: '指定席',
                    trainCarNumber: 1,
                    seatNumber: 3,
                    seatColumn: 'C',
                    codeToken: 'bd07ab55-3fde-43a6-9073-0d334f4e1a3e',
                },
            ],
        },
    ];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const activeReservations = reservations?.filter((reservation) => {
        const departureDate = new Date(reservation.rideDate);
        return departureDate >= now;
    });

    const pastReservations = reservations?.filter((reservation) => {
        const departureDate = new Date(reservation.rideDate);
        return departureDate < now;
    });

    const filteredReservations =
        selectedTab === 'active' ? activeReservations : pastReservations;

    return (
        <>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
                <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                <div className="bg-primary/8 flex gap-6 rounded-3xl p-2">
                    <div className="flex w-full items-center">
                        <button
                            onClick={() => setSelectedTab('active')}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                                selectedTab === 'active'
                                    ? 'bg-white font-bold shadow'
                                    : ''
                            } `}
                        >
                            <CiCalendar />
                            有効（{activeReservations?.length}）
                        </button>
                        <button
                            onClick={() => setSelectedTab('past')}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                                selectedTab === 'past'
                                    ? 'bg-white font-bold shadow'
                                    : ''
                            } `}
                        >
                            <RiGroupLine />
                            過去（{pastReservations?.length}）
                        </button>
                    </div>
                </div>
                {filteredReservations && filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => {
                        return (
                            <ReservationSelectItem
                                key={reservation.purchaseId}
                                details={reservation}
                            />
                        );
                    })
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
