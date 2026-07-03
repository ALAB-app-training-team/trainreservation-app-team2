import { Suspense } from 'react';

import { ScheduleSearchBody } from '@/features/schedule/components/ScheduleSearchBody/ScheduleSearchBody';
import { ScheduleSearchBodySkeleton } from '@/features/schedule/components/ScheduleSearchBody/ScheduleSearchBodySkeleton';

export function ScheduleSearch() {
    return (
        <>
            <Suspense fallback={<ScheduleSearchBodySkeleton />}>
                <ScheduleSearchBody />
            </Suspense>
        </>
    );
}
