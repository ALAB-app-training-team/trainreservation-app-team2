import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import {
    RESERVEDTICKET_MODE,
    RESERVEDTICKET_ROLE,
} from '@/features/reservation/constants/ReservedTicketState';
import type { SelectSeatsLocationState } from '@/features/schedule/types/SelectSeatsLocationState';

type SelectSeatsHeaderProps = Pick<
    SelectSeatsLocationState,
    | 'searchRequestDto'
    | 'isChanging'
    | 'isFromReservedTicket'
    | 'isBack'
    | 'reservationId'
    | 'preChangeScheduleInfo'
    | 'preChangeReservedSeats'
>;

export function SelectSeatsHeader({
    searchRequestDto,
    isChanging,
    isFromReservedTicket,
    isBack,
    reservationId,
    preChangeScheduleInfo,
    preChangeReservedSeats,
}: SelectSeatsHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-start gap-2 p-4 pb-0">
            {searchRequestDto !== null ? (
                <button
                    data-testid={'back-button-in-selectseat'}
                    type="button"
                    className="w-fit"
                    onClick={() => {
                        navigate('/scheduleSearch', {
                            state: {
                                searchRequestDto,
                                isChanging: isChanging,
                                isBack: isBack,
                                ...(reservationId && { reservationId }),
                                ...(preChangeReservedSeats && {
                                    reservedSeats: preChangeReservedSeats,
                                }),
                                ...(preChangeScheduleInfo && {
                                    preChangeScheduleInfo,
                                }),
                            },
                        });
                    }}
                >
                    <div className="flex items-center gap-2">
                        <LuArrowLeft />
                        検索画面に戻る
                    </div>
                </button>
            ) : isFromReservedTicket ? (
                <button
                    data-testid={'back-button-in-selectseat'}
                    type="button"
                    className="w-fit"
                    onClick={() => {
                        navigate('/reservedTicket', {
                            state: {
                                reservationId: reservationId,
                                mode: RESERVEDTICKET_MODE.detail,
                                role: RESERVEDTICKET_ROLE.account,
                            },
                        });
                    }}
                >
                    <div className="flex items-center gap-2">
                        <LuArrowLeft />
                        予約詳細へ戻る
                    </div>
                </button>
            ) : (
                <button
                    data-testid={'back-button-in-selectseat'}
                    type="button"
                    className="w-fit"
                    onClick={() => {
                        navigate('/reservationList');
                    }}
                >
                    <div className="flex items-center gap-2">
                        <LuArrowLeft />
                        予約一覧へ戻る
                    </div>
                </button>
            )}
            {reservationId !== undefined && (
                <h1 className="!m-0 text-left !text-3xl">予約変更</h1>
            )}
        </div>
    );
}
