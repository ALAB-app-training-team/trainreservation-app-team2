import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import {
    RESERVEDTICKET_MODE,
    RESERVEDTICKET_ROLE,
} from '@/features/reservation/constants/ReservedTicketState';
import type { ScheduleSearchLocationState } from '@/features/schedule/types/ScheduleSearchLocationState';

type ScheduleSearchHeaderProps = Pick<ScheduleSearchLocationState, 'isBack'> &
    Partial<
        Pick<
            ScheduleSearchLocationState,
            'isChanging' | 'isFromReservedTicket' | 'reservationId'
        >
    >;

export function ScheduleSearchHeader({
    isBack,
    isChanging,
    isFromReservedTicket,
    reservationId,
}: ScheduleSearchHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-start gap-2">
            {isBack ? (
                <button
                    data-testid={'back-button-in-scheduleSearch'}
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
            ) : isFromReservedTicket || isChanging ? (
                <button
                    data-testid={'back-button-in-scheduleSearch'}
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
            ) : null}
            {(isBack || isFromReservedTicket || isChanging) && (
                <h1 className="!m-0 text-left !text-3xl">予約変更</h1>
            )}
        </div>
    );
}
