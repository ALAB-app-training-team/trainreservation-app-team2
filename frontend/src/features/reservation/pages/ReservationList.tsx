import { Suspense } from 'react';

import { ReservationListBody } from '@/features/reservation/components/ReservationList/ReservationListBody';
import { ReservationListBodySkeleton } from '@/features/reservation/components/ReservationList/ReservationListBodySkeletons';

export function ReservationList() {
    return (
        <>
            <Suspense fallback={<ReservationListBodySkeleton />}>
                <ReservationListBody />
            </Suspense>
        </>
    );
}
