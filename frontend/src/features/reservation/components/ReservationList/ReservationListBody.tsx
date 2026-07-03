import { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { RiGroupLine } from 'react-icons/ri';

import { ReservationSelectItem } from '@/features/reservation/components/ReservationList/ReservationSelectItem';
import { useReservationList } from '@/features/reservation/hooks/useReservationList';

export function ReservationListBody() {
    const [selectedTab, setSelectedTab] = useState<'active' | 'past'>('active');
    const { reservations } = useReservationList();

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
