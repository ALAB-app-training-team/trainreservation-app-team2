import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { LuArrowLeft } from 'react-icons/lu';
import { RiGroupLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { CompanionModal } from '@/features/reservation/components/CompanionModal';
import { ReservationChangeConfirmModal } from '@/features/reservation/components/ReservationChangeConfirmModal';
import { ReservationRefundConfirmModal } from '@/features/reservation/components/ReservationRefundConfirmModal';
import { ReservedTicketInfo } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfo';
import { ReservedTicketInfoSkeleton } from '@/features/reservation/components/ReservedTicketInfo/ReservedTicketInfoSkeleton';
import { ReservedTicketQrCode } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCode';
import { ReservedTicketQrCodeSkeleton } from '@/features/reservation/components/ReservedTicketQrCode/ReservedTicketQrCodeSkeleton';
import { TicketShare } from '@/features/reservation/components/TicketShare';
import { useChangeModal } from '@/features/reservation/hooks/useChangeModal';
import { useReservedTicketConfig } from '@/features/reservation/hooks/useReservedTicketConfig';
import { useReservedTickets } from '@/features/reservation/hooks/useReservedTickets';
import type { ReservedSeatUpdateDto } from '@/features/reservation/types/ReservedSeatUpdateDto';
import { CustomModal } from '@/shared/components/CustomModal';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { useModal } from '@/shared/hooks/useModal';
import { useToastForRedirect } from '@/shared/hooks/useToastForRedirect';
import { removeGuestReservation } from '@/shared/utils/RemoveGuestReservation';

export function ReservedTicket() {
    useToastForRedirect();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { reservationId, mode, role } = location.state;
    const {
        reservedTickets,
        updateCompanions,
        isUpdating,
        handleRefundReservation,
    } = useReservedTickets(reservationId);
    const {
        isBack,
        title,
        isDeleted,
        canCancelReservation,
        canUpdateReservation,
        canUpdateCompanions,
        canShareLink,
    } = useReservedTicketConfig(reservedTickets, mode, role);
    const {
        isOpen: isCompanionsModalOpen,
        handleModalOpen: handleCompanionsModalOpen,
        onRequestClose: onCompanionsModalRequestClose,
    } = useModal();
    const {
        isOpen: isRefundConfirmModalOpen,
        handleModalOpen: handleRefundConfirmModalOpen,
        onRequestClose: onRefundConfirmModalRequestClose,
    } = useModal();
    const {
        isOpen: isChangeConfirmModalOpen,
        handleModalOpen: handleChangeConfirmModalOpen,
        onRequestClose: onChangeConfirmModalRequestClose,
    } = useModal();
    const { handleChangeTrain, handleChangeSeat } = useChangeModal(
        onChangeConfirmModalRequestClose,
        false,
        true,
        reservedTickets,
    );
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
    const [isInvalid, setIsInvalid] = useState<boolean>(true);

    const handleUpdateCompanions = async (
        formValues: ReservedSeatUpdateDto[],
    ) => {
        if (isUpdating || isInvalid) return;
        try {
            await updateCompanions(formValues);
            onCompanionsModalRequestClose();
        } catch {
            toast.error(ERROR_MESSAGE.COMPANION, {
                duration: Infinity,
                action: {
                    label: 'OK',
                    onClick: () => {},
                },
                classNames: {
                    title: 'text-left whitespace-pre-line',
                    actionButton: '!px-4 !py-2 !text-base !h-auto',
                },
            });
        }
    };

    const handleReservationRefund = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await handleRefundReservation();
            toast.success('予約を取り消しました');
            if (accountInfo !== null) {
                navigate('/reservationList');
            } else {
                navigate('/scheduleSearch');
            }
        } catch {
            toast.error(ERROR_MESSAGE.REFUND_RETRY, {
                duration: Infinity,
                action: {
                    label: 'OK',
                    onClick: () => {},
                },
                classNames: {
                    title: 'text-left whitespace-pre-line',
                    actionButton: '!px-4 !py-2 !text-base !h-auto',
                },
            });
        } finally {
            setIsSubmitting(false);
            onRefundConfirmModalRequestClose();
        }
    };

    return (
        <>
            <div className="mx-auto flex w-full max-w-5xl min-w-90 flex-col items-center gap-2 p-4 md:w-7/10">
                {isBack && (
                    <div className="w-full text-left">
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
                    </div>
                )}
                <div className="w-full text-left">
                    <h1 data-testid="reserve-title" className="m-0! text-3xl!">
                        {title}
                    </h1>
                </div>
                {isDeleted ? (
                    <Suspense fallback={<ReservedTicketInfoSkeleton />}>
                        <ReservedTicketInfo ticketInfo={reservedTickets} />
                    </Suspense>
                ) : (
                    <>
                        <Suspense fallback={<ReservedTicketQrCodeSkeleton />}>
                            <ReservedTicketQrCode
                                trainTypeName={reservedTickets.trainTypeName}
                                reservedSeats={reservedTickets.reservedSeats}
                            />
                        </Suspense>
                        <Suspense fallback={<ReservedTicketInfoSkeleton />}>
                            <ReservedTicketInfo ticketInfo={reservedTickets} />
                        </Suspense>
                    </>
                )}
                <div className="flex w-full flex-col gap-4 md:flex-row">
                    {canCancelReservation && (
                        <button
                            onClick={handleRefundConfirmModalOpen}
                            disabled={isSubmitting}
                            className="border-primary text-primary flex w-full items-center justify-center gap-2 rounded-xl border-2 p-2 text-sm"
                        >
                            <IoTrashOutline className="h-4 w-4" />
                            キャンセル
                        </button>
                    )}
                    {canUpdateReservation && (
                        <button
                            onClick={handleChangeConfirmModalOpen}
                            disabled={isSubmitting}
                            className="border-primary text-primary flex w-full items-center justify-center gap-2 rounded-xl border-2 p-2 text-sm"
                        >
                            <FaEdit className="h-4 w-4" />
                            予約を変更
                        </button>
                    )}
                    {canShareLink && <TicketShare shareUrl={shareUrl} />}
                    {canUpdateCompanions && (
                        <button
                            onClick={handleCompanionsModalOpen}
                            className="bg-primary flex w-full items-center justify-center gap-2 rounded-xl p-2 text-sm text-white"
                        >
                            <RiGroupLine className="h-4 w-4" />
                            同行者に割り当て
                        </button>
                    )}
                </div>
            </div>
            <CustomModal
                isOpen={isCompanionsModalOpen}
                onRequestClose={onCompanionsModalRequestClose}
            >
                <CompanionModal
                    isInvalid={isInvalid}
                    setIsInvalid={setIsInvalid}
                    isSubmitting={isUpdating}
                    handleSubmit={handleUpdateCompanions}
                    reservedSeats={reservedTickets.reservedSeats}
                />
            </CustomModal>
            <CustomModal
                isOpen={isRefundConfirmModalOpen}
                onRequestClose={onRefundConfirmModalRequestClose}
            >
                <ReservationRefundConfirmModal
                    onClick={handleReservationRefund}
                    onRequestClose={onRefundConfirmModalRequestClose}
                    isSubmitting={isSubmitting}
                    detail={reservedTickets}
                />
            </CustomModal>
            <CustomModal
                isOpen={isChangeConfirmModalOpen}
                onRequestClose={onChangeConfirmModalRequestClose}
            >
                <ReservationChangeConfirmModal
                    onChangeSeatClick={handleChangeSeat}
                    onChangeTrainClick={handleChangeTrain}
                    onRequestClose={onChangeConfirmModalRequestClose}
                    isSubmitting={isSubmitting}
                    detail={reservedTickets}
                />
            </CustomModal>
        </>
    );
}
