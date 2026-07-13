import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { RiGroupLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { ReservationSelectItem } from '@/features/reservation/components/ReservationList/ReservationSelectItem';
import { RESERVATION_TAB } from '@/features/reservation/constants/ReservationTab';
import { useReservationList } from '@/features/reservation/hooks/useReservationList';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationTabCd } from '@/features/reservation/types/ReservationTabCd';

export function ReservationListBody() {
    const [selectedTab, setSelectedTab] = useState<ReservationTabCd>('ACTIVE');
    const { getReservation } = useReservationList();
    const navigate = useNavigate();
    const guestLoginInfo = () => {
        const info = sessionStorage.getItem('guestLoginInfo');
        if (info === null) {
            alert('セッションが切れました。再ログインしてください。');
            navigate('/reservationGuestLogin');
            return { reserverName: '', reserverMail: '' };
        } else {
            const resultJson: ReservationListRequestDto = JSON.parse(info);
            return resultJson;
        }
    };

    const { data: reservationList = [] } = useSuspenseQuery({
        queryKey: ['reservationList'],
        queryFn: () => getReservation(guestLoginInfo()),
        initialData: () => [],
        refetchOnMount: true,
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const activeReservations = reservationList
        ?.filter((reservation) => {
            const departureDate = new Date(reservation.rideDate);
            return departureDate >= now;
        })
        .sort(
            (a, b) =>
                new Date(a.rideDate).getDate() -
                    new Date(b.rideDate).getDate() ||
                a.departureTime.localeCompare(b.departureTime),
        );

    const pastReservations = reservationList
        ?.filter((reservation) => {
            const departureDate = new Date(reservation.rideDate);
            return departureDate < now;
        })
        .sort(
            (a, b) =>
                new Date(a.rideDate).getDate() -
                    new Date(b.rideDate).getDate() ||
                a.departureTime.localeCompare(b.departureTime),
        );

    const filteredReservations =
        selectedTab === 'ACTIVE' ? activeReservations : pastReservations;

    return (
        <>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
                <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                <div className="bg-primary/8 flex gap-6 rounded-3xl p-2">
                    <div className="flex w-full items-center">
                        <button
                            onClick={() => setSelectedTab('ACTIVE')}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                                selectedTab === 'ACTIVE'
                                    ? 'bg-white font-bold shadow'
                                    : ''
                            } `}
                        >
                            <CiCalendar />
                            {`${RESERVATION_TAB['ACTIVE']} （${activeReservations?.length}）`}
                        </button>
                        <button
                            onClick={() => setSelectedTab('PAST')}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                                selectedTab === 'PAST'
                                    ? 'bg-white font-bold shadow'
                                    : ''
                            } `}
                        >
                            <RiGroupLine />
                            {`${RESERVATION_TAB['PAST']} （${pastReservations?.length}）`}
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
