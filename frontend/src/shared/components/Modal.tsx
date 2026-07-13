import Modal from 'react-modal';

type CustomModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    content: React.ReactNode;
};
export function CustomModal({
    isOpen,
    onRequestClose,
    content,
}: CustomModalProps) {
    return (
        <>
            <Modal isOpen={isOpen} onRequestClose={() => onRequestClose}>
                <div>{content}</div>
            </Modal>
        </>
    );
}
