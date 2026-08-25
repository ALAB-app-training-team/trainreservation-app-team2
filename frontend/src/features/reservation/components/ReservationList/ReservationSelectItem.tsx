import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState } from 'react';
import { BsQrCode } from 'react-icons/bs';
import { FaClock, FaEdit, FaSearch } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { LuTicket } from 'react-icons/lu';
import { MdMoreVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { ReservedSeats } from '@/features/reservation/components/ReservedSeats';
import {
    RESERVEDTICKET_MODE,
    RESERVEDTICKET_ROLE,
} from '@/features/reservation/constants/ReservedTicketState';
import { useReservationSelectItemConfig } from '@/features/reservation/hooks/useReservationSelectItemConfig';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';

type ReservationSelectItemProps = {
    details: ReservationResponseDto;
    onRefundClicked: (details: ReservationResponseDto) => void;
    onChangeClicked: (details: ReservationResponseDto) => void;
};

export function ReservationSelectItem({
    details,
    onRefundClicked,
    onChangeClicked,
}: ReservationSelectItemProps) {
    const navigate = useNavigate();
    const {
        canCancelReservation,
        canUpdateReservation,
        canCheckReservation,
        canSearchReturinTrip,
        showThreeDotsMenu,
    } = useReservationSelectItemConfig(details);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { ref: menuRef } = useOutsideClick(
        () => setIsMenuOpen(false),
        isMenuOpen,
    );
    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const totalFare = details.reservedSeats.reduce(
        (sum, seat) => sum + (seat.seatFare || 0),
        0,
    );

    const handleReservationDetail = () => {
        navigate('/reservedTicket', {
            state: {
                reservationId: details.reservationId,
                role: RESERVEDTICKET_ROLE.account,
                mode: RESERVEDTICKET_MODE.detail,
            },
        });
        window.scrollTo(0, 0);
    };

    const handleSearchReturnTrip = () => {
        const searchRequestDto: Partial<SearchRequestDto> = {
            departureStationCd: details.arrivalStationCd,
            arrivalStationCd: details.departureStationCd,
        };
        navigate('/scheduleSearch', {
            state: {
                searchRequestDto: searchRequestDto,
            },
        });
    };

    dayjs.extend(customParseFormat);

    return (
        <div className="border-primary-light flex flex-col gap-2 rounded-2xl border-2 p-8">
            <div className="flex-col">
                <div className="flex">
                    <div className="flex grow-2 items-center gap-2">
                        <LuTicket />
                        <label>{details.trainTypeName}</label>
                    </div>
                </div>
                <div className="flex py-2 text-xl font-bold">
                    <label>
                        {details.departureStationName} →{' '}
                        {details.arrivalStationName}
                    </label>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex w-full flex-col items-start">
                    <div className="flex grow-2 items-center gap-2">
                        <FaClock />
                        <label>出発</label>
                    </div>
                    <label
                        data-testid="ride-date"
                        className="text-xl font-bold"
                    >
                        {dayjs(details.rideDate).format('YYYY年MM月DD日')}{' '}
                    </label>
                    <label className="text-xl font-bold">
                        {dayjs(details.departureTime, 'HH:mm:ss').format(
                            'HH:mm',
                        )}
                    </label>
                </div>
            </div>
            <div className="border-primary/20 border-b-2 py-2">
                <ReservedSeats
                    id="reservationList"
                    title="座席"
                    seats={details.reservedSeats}
                />
            </div>
            <div className="flex items-center justify-between py-2">
                <div className="flex items-baseline">
                    <div>お支払い合計：</div>
                    <div
                        data-testid="total-fare"
                        className="text-primary text-xl font-bold"
                    >
                        ￥{totalFare.toLocaleString()}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    {canSearchReturinTrip && (
                        <button
                            onClick={handleSearchReturnTrip}
                            className="border-primary text-primary flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm"
                        >
                            <FaSearch />
                            復路で検索
                        </button>
                    )}
                    {canCheckReservation && (
                        <button
                            onClick={handleReservationDetail}
                            className="bg-primary flex items-center justify-center gap-4 rounded-md px-4 py-2 text-sm text-white"
                        >
                            <BsQrCode />
                            チケットを表示
                        </button>
                    )}
                    {showThreeDotsMenu && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={handleMenuOpen}
                                className="text-primary py-2"
                                data-testid="three-dots-button"
                            >
                                <MdMoreVert />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-full right-1 z-50 flex w-40 flex-col gap-2 rounded-md bg-white p-2 text-sm font-bold shadow-md">
                                    <div className="flex w-full flex-col gap-2 text-left">
                                        {canCancelReservation && (
                                            <button
                                                onClick={() =>
                                                    onRefundClicked(details)
                                                }
                                                className="flex w-full items-center gap-4 px-4 py-2 hover:bg-gray-100"
                                                data-testid={'refund-button'}
                                            >
                                                <IoTrashOutline />
                                                キャンセル
                                            </button>
                                        )}
                                        {canUpdateReservation && (
                                            <button
                                                onClick={() =>
                                                    onChangeClicked(details)
                                                }
                                                className="flex w-full items-center gap-4 px-4 py-2 hover:bg-gray-100"
                                                data-testid={'change-button'}
                                            >
                                                <FaEdit />
                                                予約を変更
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
