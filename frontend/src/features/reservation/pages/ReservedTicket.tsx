import { Suspense } from "react";
import { ReservedTicketInfo } from "../components/ReservedTicketInfo/ReservedTicketInfo";
import { ReservedTicketInfoSkeleton } from "../components/ReservedTicketInfo/ReservedTicketInfoSkeleton";
import { useReservedTickets } from "../hooks/useReservedTickets";

export function ReservedTicket() {
  const { reservedTickets } = useReservedTickets(
    "21d9af6d-64cc-4011-b897-271075135016",
  ); /*TODO:パラメータを動的にする*/

  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full p-4">
        {/* TODO: 戻るボタンを作る */}
        <div className="w-full md:w-7/10 min-w-[360px]">
          <Suspense fallback={<ReservedTicketInfoSkeleton />}>
            <ReservedTicketInfo ticketInfo={reservedTickets} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
