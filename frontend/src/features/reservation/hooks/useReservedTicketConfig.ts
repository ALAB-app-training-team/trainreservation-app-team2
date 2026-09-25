import {
    RESERVEDTICKET_MODE,
    RESERVEDTICKET_ROLE,
} from '@/features/reservation/constants/ReservedTicketState';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import { isDeparted } from '@/shared/utils/IsDeparted';

export function useReservedTicketConfig(
    reservedTickets: ReservationResponseDto,
    mode: string,
    role: string,
) {
    const isBack =
        mode == RESERVEDTICKET_MODE.detail &&
        role == RESERVEDTICKET_ROLE.account;
    const isReserver = reservedTickets.isReserverMatched;
    const isDeleted = reservedTickets.isDeleted;
    const title = isDeleted
        ? RESERVEDTICKET_MODE.canceled
        : mode == RESERVEDTICKET_MODE.detail &&
            role == RESERVEDTICKET_ROLE.account
          ? null
          : mode;

    const hasDeparted = isDeparted(
        reservedTickets.rideDate,
        reservedTickets.departureTime,
    );

    const canCancelReservation = !isDeleted && isReserver && !hasDeparted;
    const canUpdateReservation =
        !isDeleted &&
        role == RESERVEDTICKET_ROLE.account &&
        isReserver &&
        !hasDeparted;
    const canUpdateCompanions = !isDeleted && isReserver;
    const isSoleCompanionsAction =
        canUpdateCompanions && !canCancelReservation && !canUpdateReservation;
    const canShareLink = !isDeleted;

    return {
        isBack,
        title,
        isDeleted,
        canCancelReservation,
        canUpdateReservation,
        canUpdateCompanions,
        isSoleCompanionsAction,
        canShareLink,
    };
}
