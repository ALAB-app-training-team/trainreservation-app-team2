import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReservedTicketInfo } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfo';
import { ReservedTicketInfoSkeleton } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfoSkeleton';
import { ReservedTicketQrCode } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCode';
import { ReservedTicketQrCodeSkeleton } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCodeSkeleton';
import { useReservedTickets } from '@/features/reservation/hooks/useReservedTickets';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';

export function ReservedTicket() {
    const location = useLocation();
    const navigate = useNavigate();
    const { purchaseId, isBack } = location.state;
    const { reservedTickets } = useReservedTickets(purchaseId);

    const queryClient = useQueryClient();
    useEffect(() => {
        const nv = performance.getEntriesByType(
            'navigation',
        )[0] as PerformanceNavigationTiming;
        if (!isBack && nv.type !== 'reload') {
            removeGuestReservation(queryClient);
        }
    }, []);

    return (
        <>
            <div className="flex w-full flex-col items-center gap-4 p-4">
                <div className="w-full max-w-5xl min-w-[360px] md:w-7/10">
                    <div className="flex items-center justify-start">
                        {isBack ? (
                            <button
                                type="button"
                                onClick={() => {
                                    navigate('/reservationList');
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <LuArrowLeft />
                                    予約一覧へ戻る
                                </div>
                            </button>
                        ) : (
                            <h1
                                date-testid="reserve-complete"
                                className="!m-0 text-left !text-3xl"
                            >
                                予約完了
                            </h1>
                        )}
                    </div>
                    <Suspense fallback={<ReservedTicketQrCodeSkeleton />}>
                        <ReservedTicketQrCode
                            trainTypeName={reservedTickets.trainTypeName}
                            reservedSeats={reservedTickets.reservedSeats}
                        />
                    </Suspense>
                    <Suspense fallback={<ReservedTicketInfoSkeleton />}>
                        <ReservedTicketInfo ticketInfo={reservedTickets} />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
