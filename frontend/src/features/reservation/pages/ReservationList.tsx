import { Suspense } from 'react';

import { ReservationListBody } from '@/features/reservation/components/ReservationList/ReservationListBody';
import { ReservationListBodySkeleton } from '@/features/reservation/components/ReservationList/ReservationListBodySkeletons';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';

export function ReservationList() {
    useToastForRedirect();
    return (
        <>
            <Suspense fallback={<ReservationListBodySkeleton />}>
                <ReservationListBody />
            </Suspense>
        </>
    );
}
