import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import type { GuestLoginFormError } from '@/features/reservation/types/GuestLoginFormError';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservationListRequestDto() {
    const navigate = useNavigate();
    const [guestLoginForm, setGuestLoginForm] =
        useState<ReservationListRequestDto>({
            reserverName: '',
            reserverMail: '',
        });
    const [errors, setErrors] = useState<GuestLoginFormError>({
        reserverName: '',
        reserverMail: '',
        searchReservation: '',
    });
    const removeWhiteSpace = (value: string) => {
        return value.replace(/\s+/g, '');
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGuestLoginForm((prev) => ({
            ...prev,
            [name]: removeWhiteSpace(value),
        }));
    };
    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'reserverName':
                if (!value.trim()) {
                    return '予約者氏名を入力してください。';
                }
                return '';
            case 'reserverMail':
                if (!value.trim()) {
                    return 'メールアドレスを入力してください。';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+/.test(value)) {
                    return '正しいメールアドレスの形式で入力してください。';
                }
                return '';
            default:
                return '';
        }
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleGuestLogin = async () => {
        const newErrors = {
            reserverName: validateField(
                'reserverName',
                guestLoginForm.reserverName,
            ),
            reserverMail: validateField(
                'reserverMail',
                guestLoginForm.reserverMail,
            ),
            searchReservation: '',
        };
        setErrors(newErrors);
        if (newErrors.reserverName || newErrors.reserverMail) {
            return;
        }
        const response = await axios.get<ReservationResponseDto[]>(
            ENDPOINTS.RESERVATIONLIST(),
            {
                params: guestLoginForm,
            },
        );
        if (response.data.length === 0) {
            setErrors((prev) => ({
                ...prev,
                searchReservation: '予約情報が見つかりません。',
            }));
            return;
        }
        navigate('/reservationList', {
            state: { reservationList: response.data },
        });
        window.scrollTo(0, 0);
    };

    return {
        guestLoginForm,
        errors,
        handleChange,
        handleBlur,
        handleGuestLogin,
    };
}
