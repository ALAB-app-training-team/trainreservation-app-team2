import { Suspense } from "react";
import { ReservedTicketInfo } from "../components/ReservedTicketInfo/ReservedTicketInfo";
import { ReservedTicketInfoSkeleton } from "../components/ReservedTicketInfo/ReservedTicketInfoSkeleton";
import { useReservedTickets } from "../hooks/useReservedTickets";
import { GoHome } from "react-icons/go";
import { useNavigate } from "react-router-dom";

export function ReservedTicket() {
  const { reservedTickets } = useReservedTickets(
    "37ce698d-1780-4f43-964c-f75d816b87e3",
  ); /*TODO:パラメータを動的にする*/

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full p-4">
        {/* TODO: 戻るボタンを作る */}
        <div className="w-full md:w-7/10">
          <button
            onClick={() => {
              navigate("/searchSchedule");
            }}
            className="flex ml-auto items-center gap-2 px-4 border-2 rounded-xl border-primary-light cursor-pointer"
          >
            <div>ホーム</div>
            <GoHome />
          </button>
        </div>
        <div className="w-full md:w-7/10">
          <Suspense fallback={<ReservedTicketInfoSkeleton />}>
            <ReservedTicketInfo ticketInfo={reservedTickets} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
