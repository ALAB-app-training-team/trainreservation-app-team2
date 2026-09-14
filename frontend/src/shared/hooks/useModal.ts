import { useState } from 'react';

export function useModal(initialOpen = false) {
    const [isOpen, setIsOpen] = useState<boolean>(initialOpen);

    const handleModalOpen = () => {
        setIsOpen(true);
    };

    const onRequestClose = () => {
        setIsOpen(false);
    };

    return { isOpen, handleModalOpen, onRequestClose };
}
