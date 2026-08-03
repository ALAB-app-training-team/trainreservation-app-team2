import { useEffect } from 'react';
import { toast } from 'sonner';

export function useToastForRedirect() {
    useEffect(() => {
        const message = sessionStorage.getItem('message');
        sessionStorage.removeItem('message');

        if (message) {
            setTimeout(() => {
                toast.warning(message);
            }, 0);
        }
    }, []);
}
