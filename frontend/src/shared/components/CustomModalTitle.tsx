import { IoClose } from 'react-icons/io5';

type CustomModalTitleProps = {
    title: string;
    onRequestClose: () => void;
    isSubmitting: boolean;
};
export function CustomModalTitle({
    title,
    onRequestClose,
    isSubmitting,
}: CustomModalTitleProps) {
    return (
        <>
            <div className="relative flex w-full">
                <h1 className="!m-0 text-left !text-xl">{title}</h1>
                <button
                    data-testid="modal-close-button"
                    onClick={onRequestClose}
                    disabled={isSubmitting}
                    className="absolute right-0 rounded-full"
                >
                    <IoClose className="h-6 w-6" />
                </button>
            </div>
        </>
    );
}
