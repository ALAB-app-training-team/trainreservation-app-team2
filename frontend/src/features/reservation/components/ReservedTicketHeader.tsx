import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { TicketShare } from '@/features/reservation/components/TicketShare';

type ReservedTicketHeaderProps = {
    isBack: boolean;
    canShareLink: boolean;
    shareUrl: string;
};

export function ReservedTicketHeader({
    isBack,
    canShareLink,
    shareUrl,
}: ReservedTicketHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex w-full items-center justify-between gap-2 text-left">
            {isBack ? (
                <button
                    type="button"
                    onClick={() => {
                        navigate('/reservationList');
                    }}
                >
                    <div className="flex items-center gap-2">
                        <LuArrowLeft />
                        予約一覧へ戻る
                    </div>
                </button>
            ) : (
                <div />
            )}
            {canShareLink && <TicketShare shareUrl={shareUrl} />}
        </div>
    );
}
