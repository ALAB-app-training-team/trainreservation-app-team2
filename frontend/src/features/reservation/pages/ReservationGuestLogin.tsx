import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';

import { ReservationGuestLoginBody } from '@/features/reservation/components/ReservationGuestLogin/ReservationGuestLoginBody';
import { ReservationGuestLoginBodySkeleton } from '@/features/reservation/components/ReservationGuestLogin/ReservationGuestLoginBodySkeleton';

export function ReservationGuestLogin() {
    const queryClient = useQueryClient();
    useEffect(() => {
        sessionStorage.removeItem('guestLoginInfo');
        queryClient.removeQueries({ queryKey: ['reservationList'] });
    }, []);
    return (
        <>
            <div className="flex w-full flex-col items-center gap-4 p-4">
                <div className="w-full max-w-5xl min-w-[360px] md:w-7/10">
                    <div className="mb-4 flex items-center justify-start">
                        <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                    </div>
                    <Suspense fallback={<ReservationGuestLoginBodySkeleton />}>
                        <ReservationGuestLoginBody />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
