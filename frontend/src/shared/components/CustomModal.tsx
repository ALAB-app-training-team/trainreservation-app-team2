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
    Modal.setAppElement('#root');

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm transition-opacity"
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl transition-all focus:outline-none"
            >
                <div className="w-full overflow-y-auto">{content}</div>
            </Modal>
        </>
    );
}
