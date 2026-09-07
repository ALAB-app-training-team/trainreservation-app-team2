import { Suspense, useEffect } from 'react';

import { ReservationListBody } from '@/features/reservation/components/ReservationList/ReservationListBody';
import { ReservationListBodySkeleton } from '@/features/reservation/components/ReservationList/ReservationListBodySkeletons';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';

export function ReservationList() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useToastForRedirect();
    return (
        <>
            <Suspense fallback={<ReservationListBodySkeleton />}>
                <ReservationListBody />
            </Suspense>
        </>
    );
}
