import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { RiGroupLine } from 'react-icons/ri';

import { ENDPOINTS } from '@/api/routes';
import { ReservationSelectItem } from '@/features/reservation/components/ReservationList/ReservationSelectItem';
import { ReservationRefundConfirmModal } from '@/features/reservation/components/ReservationRefundConfirmModal';
import { RESERVATION_TAB } from '@/features/reservation/constants/ReservationTab';
import { useGuestLoginInfo } from '@/features/reservation/hooks/useGuestLoginInfo';
import { useReservationList } from '@/features/reservation/hooks/useReservationList';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import type { ReservationTabCd } from '@/features/reservation/types/ReservationTabCd';
import { CustomModal } from '@/shared/components/CustomModal';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { useModal } from '@/shared/hooks/useModal';

export function ReservationListBody() {
    const [selectedTab, setSelectedTab] = useState<ReservationTabCd>('ACTIVE');
    const { getReservation } = useReservationList();
    const { data: reservationList = [] } = useSuspenseQuery({
        queryKey: ['reservationList'],
        queryFn: () => getReservation(useGuestLoginInfo()),
        refetchOnMount: true,
    });
    const { isOpen, handleModalOpen, onRequestClose } = useModal();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedReservation, setSelectedReservation] =
        useState<ReservationResponseDto>();
    const queryClient = useQueryClient();

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const activeReservations = reservationList
        ?.filter((reservation) => {
            const departureDate = new Date(reservation.rideDate);
            return departureDate >= now && reservation.isDeleted != true;
        })
        .sort(
            (a, b) =>
                new Date(a.rideDate).getDate() -
                    new Date(b.rideDate).getDate() ||
                a.departureTime.localeCompare(b.departureTime),
        );

    const pastReservations = reservationList
        ?.filter((reservation) => {
            const departureDate = new Date(reservation.rideDate);
            return departureDate < now;
        })
        .sort(
            (a, b) =>
                new Date(a.rideDate).getDate() -
                    new Date(b.rideDate).getDate() ||
                a.departureTime.localeCompare(b.departureTime),
        );

    const filteredReservations =
        selectedTab === 'ACTIVE' ? activeReservations : pastReservations;

    const handleRefundModalOpen = (details: ReservationResponseDto) => {
        setSelectedReservation(details);
        handleModalOpen();
    };
    const handleReservationRefund = async (reservationId: string) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await axios.delete(ENDPOINTS.RESERVATION(reservationId));
            // TODO: 予約削除タブ用リストに移動するように変更する。
            queryClient.setQueryData(
                ['reservationList'],
                (old: ReservationResponseDto[] | undefined) =>
                    old?.filter(
                        (reservation) =>
                            reservation.reservationId !== reservationId,
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
                        <button
                            data-testId="active-button"
                            onClick={() => setSelectedTab('ACTIVE')}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                                selectedTab === 'ACTIVE'
                                    ? 'bg-white font-bold shadow'
                                    : ''
                            } `}
                        >
                            <CiCalendar />
                            {`${RESERVATION_TAB['ACTIVE']} （${activeReservations?.length}）`}
                        </button>
                        <button
                            data-testId="past-button"
                            onClick={() => setSelectedTab('PAST')}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl px-6 py-2 transition ${
                                selectedTab === 'PAST'
                                    ? 'bg-white font-bold shadow'
                                    : ''
                            } `}
                        >
                            <RiGroupLine />
                            {`${RESERVATION_TAB['PAST']} （${pastReservations?.length}）`}
                        </button>
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
                    <></>
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
