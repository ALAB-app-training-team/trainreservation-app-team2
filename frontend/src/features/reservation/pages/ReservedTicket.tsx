import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import { ReservedTicketInfo } from "../components/ReservedTicketInfo/ReservedTicketInfo";
import { ReservedTicketInfoSkeleton } from "../components/ReservedTicketInfo/ReservedTicketInfoSkeleton";
import { ReservedTicketQrCode } from "../components/ReservedTicketQrCode/ReservedTicketQrCode";
import { ReservedTicketQrCodeSkeleton } from "../components/ReservedTicketQrCode/ReservedTicketQrCodeSkeleton";
import { useReservedTickets } from "../hooks/useReservedTickets";

export function ReservedTicket() {
  const location = useLocation();
  const { purchaseId } = location.state;
  const { reservedTickets } = useReservedTickets(purchaseId);

  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full p-4">
        {/* TODO: 戻るボタンを作る */}
        <div className="w-full md:w-7/10 min-w-[360px]">
          <h1 className="text-left !text-3xl !m-0">予約確認</h1>
          <Suspense fallback={<ReservedTicketQrCodeSkeleton />}>
            <ReservedTicketQrCode
              train_type_name={reservedTickets.trainTypeName}
              reserved_seats={reservedTickets.reservedSeats}
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
