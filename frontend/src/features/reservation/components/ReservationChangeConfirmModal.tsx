import { CiCalendarDate, CiUser } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';

import { ReservationInfo } from '@/features/reservation/components/ReservationInfo';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

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
                <div className="relative flex w-full">
                    <h1 className="!m-0 text-left !text-xl">予約変更</h1>
                    <button
                        onClick={onRequestClose}
                        disabled={isSubmitting}
                        className="absolute right-0 rounded-full"
                    >
                        <IoClose className="h-6 w-6" />
                    </button>
                </div>
                <div>変更する内容を選択してください</div>
                <ReservationInfo details={details} />
                <div className="flex w-full items-center justify-center gap-4">
                    <button
                        onClick={() => onChangeSeatClick(details)}
                        disabled={isSubmitting}
                        className="bg-primary flex items-center rounded-lg p-2 text-white"
                    >
                        <CiUser />
                        人数・座席変更
                    </button>
                    <button
                        onClick={() => onChangeSeatClick(details)}
                        disabled={isSubmitting}
                        className="bg-primary flex items-center rounded-lg p-2 text-white"
                    >
                        <CiCalendarDate />
                        日時・経路変更
                    </button>
                </div>
            </div>
        </>
    );
}
