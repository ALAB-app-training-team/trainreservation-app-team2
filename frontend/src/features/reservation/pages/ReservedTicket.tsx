import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';

import { ReservedTicketInfo } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfo';
import { ReservedTicketInfoSkeleton } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfoSkeleton';
import { ReservedTicketQrCode } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCode';
import { ReservedTicketQrCodeSkeleton } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCodeSkeleton';
import { useReservedTickets } from '@/features/reservation/hooks/useReservedTickets';

export function ReservedTicket() {
    const location = useLocation();
    const { purchaseId } = location.state;
    const { reservedTickets } = useReservedTickets(purchaseId);

    return (
        <>
            <div className="flex w-full flex-col items-center gap-4 p-4">
                {/* TODO: 戻るボタンを作る */}
                <div className="w-full min-w-[360px] md:w-7/10">
                    <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
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
