import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservationSelectItemConfig(
    details: ReservationResponseDto,
) {
    const departureDate = new Date(details.rideDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // キャンセル
    const isCanceled = details.isDeleted;
    // 有効
    const isEabled = departureDate >= now;

    const canCancelReservation = !isCanceled && isEabled;
    const canUpdateReservation = !isCanceled && isEabled;
    const canCheckReservation = !isCanceled && isEabled;
    const canSearchReturinTrip = !isCanceled;
    const showThreeDotsMenu = canCancelReservation || canUpdateReservation;

    return {
        canCheckReservation,
        canSearchReturinTrip,
        showThreeDotsMenu,
    };
}
