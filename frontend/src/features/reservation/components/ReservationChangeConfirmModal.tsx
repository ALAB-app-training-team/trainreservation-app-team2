import { CiUser } from 'react-icons/ci';

import { ReservationInfo } from '@/features/reservation/components/ReservationInfo';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import { CustomModalTitle } from '@/shared/components/CustomModalTitle';

type ReservationRefundConfirmModalProps = {
    onChangeSeatClick: (reservation: ReservationResponseDto) => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
    details: ReservationResponseDto;
};

export function ReservationChangeConfirmModal({
    onChangeSeatClick,
    onRequestClose,
    isSubmitting,
    details,
}: ReservationRefundConfirmModalProps) {
    return (
        <>
            <div className="justify-er flex flex-col items-start gap-4">
                <CustomModalTitle
                    title="予約変更"
                    onRequestClose={onRequestClose}
                    isSubmitting={isSubmitting}
                />
                <div>変更する内容を選択してください</div>
                <ReservationInfo details={details} id="reservationChange" />
                <div className="flex w-full items-center justify-center gap-4">
                    <button
                        data-testid={'change-seat-confirm-button'}
                        onClick={() => onChangeSeatClick(details)}
                        disabled={isSubmitting}
                        className="bg-primary flex items-center rounded-lg p-2 text-white"
                    >
                        <CiUser />
                        人数・座席変更
                    </button>
                    {/* TODO:日時・経路変更実装時コメント外す
                     <button
                        onClick={() => }
                        disabled={isSubmitting}
                        className="bg-primary flex items-center rounded-lg p-2 text-white"
                    >
                        <CiCalendarDate />
                        日時・経路変更
                    </button> */}
                </div>
            </div>
        </>
    );
}
