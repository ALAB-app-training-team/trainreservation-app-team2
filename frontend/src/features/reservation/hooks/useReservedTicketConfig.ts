import {
    RESERVEDTICKET_MODE,
    RESERVEDTICKET_ROLE,
} from '@/features/reservation/constants/ReservedTicketState';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservedTicketConfig(
    reservedTickets: ReservationResponseDto,
    mode: string,
    role: string,
) {
    const isBack =
        mode == RESERVEDTICKET_MODE.detail &&
        role == RESERVEDTICKET_ROLE.account;
    const isReserver = reservedTickets.isReserverMatched;
    const isCanceled = reservedTickets.isDeleted;
    const title = isCanceled
        ? RESERVEDTICKET_MODE.canceled
        : mode == RESERVEDTICKET_MODE.detail &&
            role == RESERVEDTICKET_ROLE.account
          ? null
          : mode;

    const canCancelReservation = !isCanceled && isReserver;
    const canUpdateReservation =
        !isCanceled && role == RESERVEDTICKET_ROLE.account && isReserver;
    const canUpdateCompanions = !isCanceled && isReserver;
    const canShareLink = !isCanceled;

    return {
        isBack,
        title,
        isCanceled,
        canCancelReservation,
        canUpdateReservation,
        canUpdateCompanions,
        canShareLink,
    };
}
