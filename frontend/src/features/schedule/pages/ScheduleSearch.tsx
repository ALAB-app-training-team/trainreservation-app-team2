import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';

import { ScheduleSearchBody } from '@/features/schedule/components/ScheduleSearchBody/ScheduleSearchBody';
import { ScheduleSearchBodySkeleton } from '@/features/schedule/components/ScheduleSearchBody/ScheduleSearchBodySkeleton';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';

export function ScheduleSearch() {
    const queryClient = useQueryClient();
    useToastForRedirect();
    useEffect(() => {
        removeGuestReservation(queryClient);
    }, []);
    return (
        <>
            <Suspense fallback={<ScheduleSearchBodySkeleton />}>
                <ScheduleSearchBody />
            </Suspense>
        </>
    );
}
