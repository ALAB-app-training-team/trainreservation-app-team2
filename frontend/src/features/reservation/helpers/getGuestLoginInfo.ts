import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';

export function getGuestLoginInfo() {
    const info = sessionStorage.getItem('guestLoginInfo');
    if (info !== null) {
        const resultJson: ReservationListRequestDto = JSON.parse(info);
        return resultJson;
    }
    return { reserverName: '', reserverMail: '' };
}
