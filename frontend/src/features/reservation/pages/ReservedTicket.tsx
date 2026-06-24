import { Suspense } from "react";
import { ReservedTicketInfo } from "../components/ReservedTicketInfo/ReservedTicketInfo";
import { ReservedTicketInfoSkeleton } from "../components/ReservedTicketInfo/ReservedTicketInfoSkeleton";
import { useReservedTickets } from "../hooks/useReservedTickets";

export function ReservedTicket() {
  const { reservedTickets } =
    useReservedTickets("test"); /*TODO:パラメータを動的にする*/

  return (
    <>
      <div className="flex flex-col md:flex-row flex-col-reverse justify-between items-start gap-4 w-full p-4">
        {/* TODO: 戻るボタンを作る */}
        <div className="w-full md:w-7/10">
          <Suspense fallback={<ReservedTicketInfoSkeleton />}>
            <ReservedTicketInfo ticketInfo={reservedTickets} />
          </Suspense>
        </div>
        <div className="flex-1 w-full"></div>
      </div>
    </>
  );
}
