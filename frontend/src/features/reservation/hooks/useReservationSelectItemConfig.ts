import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import { isDeparted } from '@/shared/utils/IsDeparted';

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
    // 出発済み（当日で出発時刻を過ぎている）
    const hasDeparted = isDeparted(details.rideDate, details.departureTime);

    const isActiveReservation = !isDeleted && isEnabled;
    const canCancelReservation = !isDeleted && isEnabled && !hasDeparted;
    const canUpdateReservation = !isDeleted && isEnabled && !hasDeparted;
    const canCheckReservation = !isDeleted && isEnabled;
    const canSearchReturinTrip = !isDeleted;
    const showThreeDotsMenu = canCancelReservation || canUpdateReservation;
    const reserveThreeDotsSlot = isActiveReservation && !showThreeDotsMenu;
    const hasUnassignedSeat =
        isActiveReservation && details.reservedSeats.some((seat) => !seat.name);
    const showTotalFare = !isActiveReservation;
    const totalFare = details.reservedSeats.reduce(
        (sum, seat) => sum + (seat.seatFare || 0),
        0,
    );

    return {
        isActiveReservation,
        canCancelReservation,
        canUpdateReservation,
        canCheckReservation,
        canSearchReturinTrip,
        showThreeDotsMenu,
        reserveThreeDotsSlot,
        hasUnassignedSeat,
        showTotalFare,
        totalFare,
    };
}
