import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState } from 'react';
import { BsQrCode } from 'react-icons/bs';
import { FaEdit, FaSearch } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { MdAirlineSeatReclineExtra, MdMoreVert } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import {
    RESERVEDTICKET_MODE,
    RESERVEDTICKET_ROLE,
} from '@/features/reservation/constants/ReservedTicketState';
import { useReservationSelectItemConfig } from '@/features/reservation/hooks/useReservationSelectItemConfig';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';

dayjs.extend(customParseFormat);

const TIME_BLOCK =
    'flex min-w-0 flex-col text-left md:flex-row md:items-baseline md:gap-1.5';
const TIME_TEXT = 'text-2xl leading-tight font-bold tabular-nums md:text-3xl';
const STATION_TEXT = 'truncate text-sm md:text-base';

const formatTime = (time: string) => dayjs(time, 'HH:mm:ss').format('HH:mm');

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
        isActiveReservation,
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
            date: isActiveReservation ? details.rideDate : '',
            time: isActiveReservation ? details.arrivalTime : '',
            departureStationCd: details.arrivalStationCd,
            arrivalStationCd: details.departureStationCd,
            isArrivalTime: false,
        };
        navigate('/scheduleSearch', {
            state: {
                searchRequestDto: searchRequestDto,
            },
        });
    };

    return (
        <div
            data-testid="reservation-item"
            className="border-primary-mid-light md:border-line-strong flex flex-col gap-2 rounded-2xl border-2 p-5 text-left md:flex-row md:items-center md:gap-6 md:rounded-xl md:border md:p-4"
        >
            <div className="flex items-center gap-3 md:grow">
                <div className={TIME_BLOCK}>
                    <span
                        data-testid="list-departure-time"
                        className={TIME_TEXT}
                    >
                        {formatTime(details.departureTime)}
                    </span>
                    <span className={STATION_TEXT}>
                        {details.departureStationName}
                    </span>
                </div>
                <span
                    aria-hidden="true"
                    className="bg-primary-mid-light h-px grow md:w-8 md:grow-0"
                />
                <div className={TIME_BLOCK}>
                    <span data-testid="list-arrival-time" className={TIME_TEXT}>
                        {formatTime(details.arrivalTime)}
                    </span>
                    <span className={STATION_TEXT}>
                        {details.arrivalStationName}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2 md:shrink-0">
                <MdAirlineSeatReclineExtra className="text-xl" />
                <span>座席</span>
                <span data-testid="seat-count">
                    {details.reservedSeats.length}席
                </span>
            </div>
            <div
                aria-hidden="true"
                className="relative -mx-[22px] my-1 md:hidden"
            >
                <span className="bg-page absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                <span className="border-primary-mid-light mx-3 block border-t-2 border-dashed" />
                <span className="bg-page absolute top-0 right-0 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full" />
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <div className="flex w-full gap-2 md:w-auto">
                    {canSearchReturinTrip && (
                        <button
                            onClick={handleSearchReturnTrip}
                            className="border-primary-ink text-primary-ink flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-sm whitespace-nowrap md:gap-4 md:px-4"
                        >
                            <FaSearch />
                            復路で検索
                        </button>
                    )}
                    {canCheckReservation && (
                        <button
                            onClick={handleReservationDetail}
                            className="bg-primary flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm whitespace-nowrap text-white md:gap-4 md:px-4"
                        >
                            <BsQrCode />
                            チケットを表示
                        </button>
                    )}
                </div>
                {showThreeDotsMenu && (
                    <div
                        className="relative flex shrink-0 items-center self-stretch"
                        ref={menuRef}
                    >
                        <button
                            onClick={handleMenuOpen}
                            className="text-primary-ink hover:bg-surface-muted flex h-11 w-11 items-center justify-center rounded-md text-2xl transition"
                            data-testid="three-dots-button"
                            aria-label="予約の操作メニュー"
                            aria-expanded={isMenuOpen}
                        >
                            <MdMoreVert />
                        </button>
                        {isMenuOpen && (
                            <div className="bg-surface absolute top-full right-0 z-50 mt-1 flex w-40 flex-col gap-2 rounded-md p-2 text-left text-sm font-bold shadow-md">
                                {canUpdateReservation && (
                                    <button
                                        onClick={() => onChangeClicked(details)}
                                        className="hover:bg-surface-muted flex w-full items-center gap-4 px-4 py-2"
                                        data-testid="change-button"
                                    >
                                        <FaEdit />
                                        予約を変更
                                    </button>
                                )}
                                {canCancelReservation && (
                                    <button
                                        onClick={() => onRefundClicked(details)}
                                        className="hover:bg-surface-muted flex w-full items-center gap-4 px-4 py-2"
                                        data-testid="refund-button"
                                    >
                                        <IoTrashOutline />
                                        キャンセル
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
