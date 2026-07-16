import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReservedTicketInfo } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfo';
import { ReservedTicketInfoSkeleton } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfoSkeleton';
import { ReservedTicketQrCode } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCode';
import { ReservedTicketQrCodeSkeleton } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCodeSkeleton';
import { useGuestLoginInfo } from '@/features/reservation/hooks/useGuestLoginInfo';
import { useReservedTickets } from '@/features/reservation/hooks/useReservedTickets';

export function ReservedTicket() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getReservedTickets } = useReservedTickets();
    const { purchaseId, isBack } = location.state;
    const { data: reservedTickets } = useSuspenseQuery({
        queryKey: ['reservationTickets', purchaseId],
        queryFn: () => getReservedTickets(purchaseId, useGuestLoginInfo()),
        refetchOnMount: true,
    });

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
                            <h1 className="!m-0 text-left !text-3xl">
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
