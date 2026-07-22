import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { LuTicket } from 'react-icons/lu';
import { RiGroupLine } from 'react-icons/ri';

import { ENDPOINTS } from '@/api/routes';
import { ReservationSelectItem } from '@/features/reservation/components/ReservationList/ReservationSelectItem';
import { ReservationRefundConfirmModal } from '@/features/reservation/components/ReservationRefundConfirmModal';
import type { ReservationTabKey } from '@/features/reservation/constants/ReservationTab';
import {
    DEFAULT_RESERVATION_TAB,
    RESERVATION_TAB,
} from '@/features/reservation/constants/ReservationTab';
import { useReservationList } from '@/features/reservation/hooks/useReservationList';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import { CustomModal } from '@/shared/components/CustomModal';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { useModal } from '@/shared/hooks/useModal';

export function ReservationListBody() {
    const [selectedTab, setSelectedTab] = useState<ReservationTabKey>(
        DEFAULT_RESERVATION_TAB,
    );
    const { activeReservations, canceledReservations, pastReservations } =
        useReservationList();
    const { isOpen, handleModalOpen, onRequestClose } = useModal();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedReservation, setSelectedReservation] =
        useState<ReservationResponseDto>();
    const queryClient = useQueryClient();

    const filteredReservations =
        selectedTab === RESERVATION_TAB[0].key
            ? activeReservations
            : selectedTab === RESERVATION_TAB[1].key
              ? pastReservations
              : canceledReservations;

    const handleRefundModalOpen = (details: ReservationResponseDto) => {
        setSelectedReservation(details);
        handleModalOpen();
    };
    const handleReservationRefund = async (reservationId: string) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await axios.delete(ENDPOINTS.RESERVATION(reservationId));

            queryClient.setQueryData<ReservationResponseDto[]>(
                ['reservationList'],
                (old) =>
                    old?.map((reservation) =>
                        reservation.reservationId == reservationId
                            ? { ...reservation, isDaleted: true }
                            : reservation,
                    ),
            );
            alert('予約をキャンセルしました。');
        } catch {
            alert(ERROR_MESSAGE.REFUND_RETRY);
        } finally {
            setIsSubmitting(false);
            onRequestClose();
        }
    };

    return (
        <>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
                <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                <div className="bg-primary/8 flex gap-6 rounded-3xl p-2">
                    <div className="flex w-full items-center">
                        {RESERVATION_TAB.map((tab) => (
                            <button
                                key={tab.key}
                                data-testid={tab.testId}
                                onClick={() => setSelectedTab(tab.key)}
                                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                                    selectedTab === tab.key
                                        ? 'bg-white font-bold shadow'
                                        : ''
                                } `}
                            >
                                {tab.key === RESERVATION_TAB[0].key ? (
                                    <CiCalendar />
                                ) : tab.key === RESERVATION_TAB[1].key ? (
                                    <RiGroupLine />
                                ) : (
                                    <LuTicket />
                                )}
                                {tab.label}
                                {`(${tab.key === RESERVATION_TAB[0].key ? activeReservations?.length : tab.key === RESERVATION_TAB[1].key ? pastReservations?.length : canceledReservations?.length})`}
                            </button>
                        ))}
                    </div>
                </div>
                {filteredReservations && filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => {
                        return (
                            <ReservationSelectItem
                                key={reservation.reservationId}
                                details={reservation}
                                onRefundClicked={handleRefundModalOpen}
                            />
                        );
                    })
                ) : (
                    <>該当する予約が存在しません</>
                )}
            </div>
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
                {selectedReservation && selectedReservation.reservationId && (
                    <ReservationRefundConfirmModal
                        onClick={handleReservationRefund}
                        onRequestClose={onRequestClose}
                        isSubmitting={isSubmitting}
                        details={selectedReservation}
                        reservationId={selectedReservation.reservationId}
                    />
                )}
            </CustomModal>
        </>
    );
}
