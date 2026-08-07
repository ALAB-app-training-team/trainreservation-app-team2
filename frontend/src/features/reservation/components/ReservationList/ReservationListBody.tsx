import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { LuTicket } from 'react-icons/lu';
import { RiGroupLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import { ReservationChangeConfirmModal } from '@/features/reservation/components/ReservationChangeConfirmModal';
import { ReservationSelectItem } from '@/features/reservation/components/ReservationList/ReservationSelectItem';
import { ReservationRefundConfirmModal } from '@/features/reservation/components/ReservationRefundConfirmModal';
import type { ReservationTabKey } from '@/features/reservation/constants/ReservationTab';
import {
    DEFAULT_RESERVATION_TAB,
    RESERVATION_TAB,
} from '@/features/reservation/constants/ReservationTab';
import { useReservationList } from '@/features/reservation/hooks/useReservationList';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import { CustomModal } from '@/shared/components/CustomModal';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { useModal } from '@/shared/hooks/useModal';

export function ReservationListBody() {
    const { activeReservations, canceledReservations, pastReservations } =
        useReservationList();
    const { isOpen, handleModalOpen, onRequestClose } = useModal();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedReservation, setSelectedReservation] =
        useState<ReservationResponseDto>();
    const [isChange, setIsChange] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const getInitialTab = (): ReservationTabKey => {
        const savedTab = sessionStorage.getItem('selectedReservationTab');
        return (savedTab as ReservationTabKey) || DEFAULT_RESERVATION_TAB;
    };
    const [selectedTab, setSelectedTab] =
        useState<ReservationTabKey>(getInitialTab);
    useEffect(() => {
        sessionStorage.setItem('selectedReservationTab', selectedTab);
        window.scrollTo(0, 0);
        return () => {
            sessionStorage.removeItem('selectedReservationTab');
        };
    }, [selectedTab]);

    const filteredReservations =
        selectedTab === RESERVATION_TAB[0].key
            ? activeReservations
            : selectedTab === RESERVATION_TAB[1].key
              ? pastReservations
              : canceledReservations;

    const handleRefundModalOpen = (details: ReservationResponseDto) => {
        setIsChange(false);
        setSelectedReservation(details);
        handleModalOpen();
    };
    const handleChangeModalOpen = (details: ReservationResponseDto) => {
        setIsChange(true);
        setSelectedReservation(details);
        handleModalOpen();
    };
    const handleReservationRefund = async (reservationId: string) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await apiClient.delete(ENDPOINTS.RESERVATION(reservationId));

            queryClient.setQueryData<ReservationResponseDto[]>(
                ['reservationList'],
                (old) =>
                    old?.map((reservation) =>
                        reservation.reservationId == reservationId
                            ? { ...reservation, isDeleted: true }
                            : reservation,
                    ),
            );
            toast.success('予約を取り消しました');
        } catch {
            alert(ERROR_MESSAGE.REFUND_RETRY);
        } finally {
            setIsSubmitting(false);
            onRequestClose();
        }
    };

    const handleChangeSeat = async (details: ReservationResponseDto) => {
        const scheduleInfoDto: ScheduleInfoDto = {
            scheduleCd: details.scheduleCd,
            date: details.rideDate,
            departureTime: details.departureTime,
            arrivalTime: details.arrivalTime,
            trainTypeName: details.trainTypeName,
            departureStationCd: details.departureStationCd,
            arrivalStationCd: details.arrivalStationCd,
            departureStationName: details.departureStationName,
            arrivalStationName: details.arrivalStationName,
        };
        const searchRequestDto: SearchRequestDto | null = null;
        navigate('/selectSeat', {
            state: {
                scheduleInfoDto,
                searchRequestDto,
                reservedSeats: details.reservedSeats,
                reservationId: details.reservationId,
            },
        });
        window.scrollTo(0, 0);
        onRequestClose();
    };

    return (
        <>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
                <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                <div className="bg-primary-light sticky top-20 z-10 flex gap-6 rounded-3xl p-2">
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
                                onChangeClicked={handleChangeModalOpen}
                            />
                        );
                    })
                ) : (
                    <>該当する予約が存在しません</>
                )}
            </div>
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
                {selectedReservation?.reservationId &&
                    (isChange ? (
                        <ReservationChangeConfirmModal
                            onChangeSeatClick={handleChangeSeat}
                            onRequestClose={onRequestClose}
                            isSubmitting={isSubmitting}
                            details={selectedReservation}
                        />
                    ) : (
                        <ReservationRefundConfirmModal
                            onClick={handleReservationRefund}
                            onRequestClose={onRequestClose}
                            isSubmitting={isSubmitting}
                            details={selectedReservation}
                        />
                    ))}
            </CustomModal>
        </>
    );
}
