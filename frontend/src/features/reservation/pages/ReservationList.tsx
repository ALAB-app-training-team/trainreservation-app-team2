import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';

import { ReservationListBody } from '@/features/reservation/components/ReservationList/ReservationListBody';
import { ReservationListBodySkeleton } from '@/features/reservation/components/ReservationList/ReservationListBodySkeletons';

export function ReservationList() {
    const location = useLocation();
    const { reservationList } = location.state;
    return (
        <>
            <Suspense fallback={<ReservationListBodySkeleton />}>
                <ReservationListBody reservationList={reservationList} />
            </Suspense>
        </>
    );
}
