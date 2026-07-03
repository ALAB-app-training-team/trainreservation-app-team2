import { useNavigate } from 'react-router-dom';

import { LuTicket } from 'react-icons/lu';
import { BsQrCode } from 'react-icons/bs';
import { IoTrashOutline } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';

import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import { FormatDate } from '@/shared/hooks/useFormatDate';
import { FormatTime } from '@/shared/hooks/useFormatTime';

type ReservationSelectItemProps = {
  details: ReservationResponseDto;
};

export function ReservationSelectItem({ details }: ReservationSelectItemProps) {
  const navigate = useNavigate();

  const departureDate = new Date(details.rideDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const handleReservationDetail = () => {
    navigate("/reservedTicket", {
      state: { purchaseId: details.purchaseId },
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="border-2 border-primary-light flex flex-col gap-2 rounded-2xl p-8">
      <div className="flex-col">
        <div className="flex">
          <div className="flex grow-2 items-center gap-2 text-xl font-bold">
            <LuTicket />
            <h3>{details.trainTypeName}</h3>
          </div>
          {departureDate >= now ? (
            <div className="bg-primary right-0 flex items-center justify-center rounded-xl px-3 text-sm text-white">
              有効
            </div>
          ) : (
            <div className="bg-green-100 text-primary right-0 flex items-center justify-center rounded-xl px-3 text-sm">
              完了
            </div>
          )}
        </div>
        <div className="flex py-2">
          <h5>
            {details.departureStationName} → {details.arrivalStationName}
          </h5>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex w-full flex-col items-start">
          <h5>出発</h5>
          <h3 className="text-xl font-bold">{FormatDate(details.rideDate)} </h3>
          <h3>{FormatTime(details.departureTime)}</h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <h5>ホーム</h5>
          {/*TODO：ホーム番線を動的にする*/}
          <h3 className="text-xl font-bold">2番線</h3>
        </div>
      </div>
      <div className="flex border-b-2 py-2 border-primary/20">
        <div className="flex flex-col gap-2 self-start items-start">
          <h5>座席</h5>
          <div className="flex flex-wrap gap-2">
            {details.reservedSeats.length !== 0 ? (
              details.reservedSeats
                .sort(
                  (a, b) =>
                    a.trainCarNumber - b.trainCarNumber ||
                    a.seatNumber - b.seatNumber ||
                    a.seatColumn.localeCompare(b.seatColumn),
                )
                .map((seats) => {
                  return (
                    <div
                      key={
                        seats.trainCarNumber +
                        seats.seatNumber +
                        seats.seatColumn
                      }
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center border-primary px-2 border rounded-lg">
                        {`${seats.trainCarNumber}号車` +
                          `${seats.seatNumber}番` +
                          `${seats.seatColumn}席`}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div>座席が存在しません</div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          {/*TODO：金額を動的にする*/}
          <h3 className="text-xl font-bold">合計：￥10,000</h3>
          <div className="flex justify-end">
            {/*TODO：キャンセルと同じ区間で検索にOnClickを追加する*/}
            {departureDate >= now ? (
              <>
                <button className="flex items-center justify-center gap-2 rounded-xl px-3 text-sm text-primary">
                  <IoTrashOutline />
                  <h3>キャンセル</h3>
                </button>
                <button
                  onClick={handleReservationDetail}
                  className="bg-primary flex items-center justify-center gap-4 rounded-md px-4 py-2 text-sm text-white"
                >
                  <BsQrCode />
                  <h3>チケットを表示</h3>
                </button>
              </>
            ) : (
              <button className="bg-primary flex items-center justify-center gap-4 rounded-md px-4 py-2 text-sm text-white">
                <FaSearch />
                <h3>同じ区間で検索</h3>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
