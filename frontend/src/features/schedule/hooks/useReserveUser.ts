import { useState } from 'react';

import type { ReserveUser } from '@/features/schedule/types/ReserveUser';

export function useReserveUser() {
    const [reserveUser, setReserveUser] = useState<ReserveUser>({
        name: '',
        mail: '',
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvc: '',
    });
    const [focus, setFocus] = useState<string>('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReserveUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };
    const handleInputFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFocus(e.target.id);
    };
    return { reserveUser, focus, handleInputChange, handleInputFocus };
}
