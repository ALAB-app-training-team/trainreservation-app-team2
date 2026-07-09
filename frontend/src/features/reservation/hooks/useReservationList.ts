import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ENDPOINTS } from '@/api/routes';
import type {
    GuestLoginError,
    GuestLoginErrorKey,
} from '@/features/reservation/types/GuestLoginError';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservationList() {
    const navigate = useNavigate();
    const [guestLoginForm, setGuestLoginForm] =
        useState<ReservationListRequestDto>({
            reserverName: '',
            reserverMail: '',
        });
    const [errors, setErrors] = useState<GuestLoginError>({
        reserverName: '',
        reserverMail: '',
        searchReservation: '',
    });
    const setError = (name: string, value: string) => {
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name as GuestLoginErrorKey, value),
        }));
    };
    const validateField = (name: GuestLoginErrorKey, value: string) => {
        switch (name) {
            case 'reserverName':
                if (!value.trim()) {
                    return '予約者氏名を入力してください';
                }
                return '';
            case 'reserverMail':
                if (!value.trim()) {
                    return 'メールアドレスを入力してください';
                } else if (
                    !/^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
                        value,
                    )
                ) {
                    return '正しいメールアドレスの形式で入力してください';
                }
                return '';
            default:
                return '';
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGuestLoginForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(name, value);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setError(name, value);
    };

    const isInvalid: boolean =
        guestLoginForm.reserverName === '' ||
        guestLoginForm.reserverMail === '' ||
        errors.reserverName !== '' ||
        errors.reserverMail !== '';

    const handleGuestLogin = async () => {
        try {
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
            //     TODO:BEのAPI実装後にリクエストParamを追加する
            // const removeWhiteSpace = (value: string) => {
            //     return value.replace(/[\s\u3000]+/g, '');
            // };
            // const request = {
            //     ...guestLoginForm,
            //     reserverName: removeWhiteSpace(guestLoginForm.reserverName),
            //     reserverMail: removeWhiteSpace(guestLoginForm.reserverMail),
            // };
            const response = await axios.get<ReservationResponseDto[]>(
                ENDPOINTS.RESERVATIONLIST(),
                // TODO:BEのAPI実装後にリクエストParamを追加する
                // {
                //     params: request,
                // },,
            );
            if (response.data.length === 0) {
                setErrors((prev) => ({
                    ...prev,
                    searchReservation: '予約情報が見つかりません',
                }));
                return;
            }
            navigate('/reservationList', {
                state: { reservationList: response.data },
            });
            window.scrollTo(0, 0);
        } catch {
            setErrors((prev) => ({
                ...prev,
                searchReservation: '予約取得時に何らかのエラーが発生しました',
            }));
            return;
        }
    };

    return {
        guestLoginForm,
        errors,
        handleChange,
        handleBlur,
        handleGuestLogin,
        isInvalid,
    };
}
