import { useNavigate } from 'react-router-dom';

import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';

export function useGuestLoginInfo() {
    const navigate = useNavigate();
    const getGuestLoginInfo = () => {
        const info = sessionStorage.getItem('guestLoginInfo');
        if (info === null) {
            alert('セッションが切れました。再ログインしてください。');
            navigate('/reservationGuestLogin');
            return { reserverName: '', reserverMail: '' };
        } else {
            const resultJson: ReservationListRequestDto = JSON.parse(info);
            return resultJson;
        }
    };
    return { getGuestLoginInfo };
}
