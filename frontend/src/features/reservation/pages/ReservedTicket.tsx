import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { RiGroupLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import { CompanionModal } from '@/features/reservation/components/CompanionModal';
import { ReservedTicketInfo } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfo';
import { ReservedTicketInfoSkeleton } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfoSkeleton';
import { ReservedTicketQrCode } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCode';
import { ReservedTicketQrCodeSkeleton } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCodeSkeleton';
import { TicketShare } from '@/features/reservation/components/TicketShare';
import { useReservedTickets } from '@/features/reservation/hooks/useReservedTickets';
import type { ReservedSeatUpdateDto } from '@/features/reservation/types/ReservedSeatUpdateDto';
import { CustomModal } from '@/shared/components/CustomModal';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { useModal } from '@/shared/hooks/useModal';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';

export function ReservedTicket() {
    const location = useLocation();
    const navigate = useNavigate();
    const { reservationId, isBack, guestLogin } = location.state;
    const { reservedTickets } = useReservedTickets(reservationId);
    const { isOpen, handleModalOpen, onRequestClose } = useModal();
    const shareUrl = `${window.location.origin}/reservationGuestLogin?reservationId=${reservationId}`;
    const queryClient = useQueryClient();
    const accountInfo = localStorage.getItem('name');
    useEffect(() => {
        const nv = performance.getEntriesByType(
            'navigation',
        )[0] as PerformanceNavigationTiming;
        if (accountInfo !== null && !isBack && nv.type !== 'reload') {
            removeGuestReservation(queryClient);
        }
    }, []);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleUpdateCompanions = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const request: ReservedSeatUpdateDto[] =
                reservedTickets.reservedSeats.map((seat) => ({
                    id: seat.id,
                    name: seat.name,
                    mail: seat.mail,
                }));
            await apiClient.patch(
                ENDPOINTS.RESERVEDSEAT(reservedTickets.reservationId),
                request,
            );
        } catch {
            alert(ERROR_MESSAGE.COMPANION);
        } finally {
            setIsSubmitting(false);
            onRequestClose();
        }
    };

    return (
        <>
            <div className="mx-auto flex w-full max-w-5xl min-w-90 flex-col items-center gap-2 p-4 md:w-7/10">
                <div className="flex w-full items-center justify-start">
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
                        <h1
                            data-testid="reserve-title"
                            className="m-0! text-left text-3xl!"
                        >
                            {guestLogin ? '予約詳細' : '予約完了'}
                        </h1>
                    )}
                </div>
                <Suspense fallback={<ReservedTicketQrCodeSkeleton />}>
                    <ReservedTicketQrCode
                        trainTypeName={reservedTickets.trainTypeName}
                        reservedSeats={reservedTickets.reservedSeats}
                    />
                </Suspense>
                <Suspense fallback={<ReservedTicketInfoSkeleton />}>
                    <ReservedTicketInfo ticketInfo={reservedTickets} />
                </Suspense>
                <div className="flex w-full gap-4">
                    <TicketShare shareUrl={shareUrl} />
                    <button
                        onClick={handleModalOpen}
                        className="bg-primary flex w-full items-center justify-center gap-2 rounded-xl text-sm text-white"
                    >
                        <RiGroupLine className="h-4 w-4" />
                        <div>同行者に割り当て</div>
                    </button>
                </div>
            </div>
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
                <CompanionModal
                    isSubmitting={isSubmitting}
                    handleSubmit={handleUpdateCompanions}
                    reservedSeats={reservedTickets.reservedSeats}
                />
            </CustomModal>
        </>
    );
}
