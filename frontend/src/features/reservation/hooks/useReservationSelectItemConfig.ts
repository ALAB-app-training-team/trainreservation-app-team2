import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservationSelectItemConfig(
    details: ReservationResponseDto,
) {
    const departureDate = new Date(details.rideDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // キャンセル
    const isDeleted = details.isDeleted;
    // 有効
    const isEnabled = departureDate >= now;

    const canCancelReservation = !isDeleted && isEnabled;
    const canUpdateReservation = !isDeleted && isEnabled;
    const canCheckReservation = !isDeleted && isEnabled;
    const canSearchReturinTrip = !isDeleted;
    const showThreeDotsMenu = canCancelReservation || canUpdateReservation;

    return {
        canCancelReservation,
        canUpdateReservation,
        canCheckReservation,
        canSearchReturinTrip,
        showThreeDotsMenu,
    };
}
