import { BsQrCode } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { LuTicket } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import { FormatDate } from '@/shared/utils/FormatDate';
import { FormatTime } from '@/shared/utils/FormatTime';

type ReservationSelectItemProps = {
    details: ReservationResponseDto;
};

export function ReservationSelectItem({ details }: ReservationSelectItemProps) {
    const navigate = useNavigate();

    const departureDate = new Date(details.rideDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const handleReservationDetail = () => {
        navigate('/reservedTicket', {
            state: { purchaseId: details.purchaseId, isBack: true },
        });
        window.scrollTo(0, 0);
    };

    return (
        <div className="border-primary-light flex flex-col gap-2 rounded-2xl border-2 p-8">
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
                        <div className="text-primary right-0 flex items-center justify-center rounded-xl bg-green-100 px-3 text-sm">
                            完了
                        </div>
                    )}
                </div>
                <div className="flex py-2">
                    <label>
                        {details.departureStationName} →{' '}
                        {details.arrivalStationName}
                    </label>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex w-full flex-col items-start">
                    <label>出発</label>
                    <label className="text-xl font-bold">
                        {FormatDate(details.rideDate)}{' '}
                    </label>
                    <label>{FormatTime(details.departureTime)}</label>
                </div>
            </div>
            <div className="border-primary/20 flex border-b-2 py-2">
                <div className="flex flex-col items-start gap-2 self-start">
                    <ReservedSeats
                        id="reservationList"
                        title="座席"
                        seats={details.reservedSeats}
                    />
                </div>
            </div>
            <div>
                <div className="flex justify-end">
                    {/*TODO：キャンセルと同じ区間で検索にOnClickを追加する*/}
                    {departureDate >= now ? (
                        <>
                            <button className="text-primary flex items-center justify-center gap-2 rounded-xl px-3 text-sm">
                                <IoTrashOutline />
                                <label>キャンセル</label>
                            </button>
                            <button
                                onClick={handleReservationDetail}
                                className="bg-primary flex items-center justify-center gap-4 rounded-md px-4 py-2 text-sm text-white"
                            >
                                <BsQrCode />
                                <label>チケットを表示</label>
                            </button>
                        </>
                    ) : (
                        <button className="bg-primary flex items-center justify-center gap-4 rounded-md px-4 py-2 text-sm text-white">
                            <FaSearch />
                            <label>同じ区間で検索</label>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
