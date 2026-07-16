import { useState } from 'react';

export function useModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleModalOpen = () => {
        setIsOpen(true);
    };

    const onRequestClose = () => {
        setIsOpen(false);
    };

    return { isOpen, handleModalOpen, onRequestClose };
}
