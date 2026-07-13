type ReserveConfirmModalProps = {
    onClick: () => void;
};

export function ReserveConfirmModal({ onClick }: ReserveConfirmModalProps) {
    return (
        <>
            <div>モーダルやで</div>
            <button onClick={onClick}>ボタンやねんな</button>
        </>
    );
}
