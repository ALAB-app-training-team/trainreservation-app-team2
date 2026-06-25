import { Suspense } from "react";
import { ReservedTicketInfo } from "../components/ReservedTicketInfo/ReservedTicketInfo";
import { ReservedTicketInfoSkeleton } from "../components/ReservedTicketInfo/ReservedTicketInfoSkeleton";
import { useReservedTickets } from "../hooks/useReservedTickets";

export function ReservedTicket() {
  const { reservedTickets } = useReservedTickets(
    "37ce698d-1780-4f43-964c-f75d816b87e3",
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
