import type { ReservationResponseDto } from '../types/ReservationResponseDto';

export function useReservedTicketConfig(
    reservedTickets: ReservationResponseDto,
    mode: string,
    role: string,
) {
    const isBack = mode == '予約詳細' && role == 'account';
    const isReserver = reservedTickets.isReserverMatched;
    const isCanceled = reservedTickets.isDeleted;
    const title = isCanceled
        ? 'キャンセル済み'
        : mode == '予約詳細' && role == 'account'
          ? null
          : mode;

    const canCancelReservation = !isCanceled && isReserver;
    const canUpdateReservation = !isCanceled && role == 'account' && isReserver;
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
