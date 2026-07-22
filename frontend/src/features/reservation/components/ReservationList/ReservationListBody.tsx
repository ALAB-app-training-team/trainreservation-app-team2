import { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { RiGroupLine } from 'react-icons/ri';

import { ReservationSelectItem } from '@/features/reservation/components/ReservationList/ReservationSelectItem';
import type { ReservationTabKey } from '@/features/reservation/constants/ReservationTab';
import {
    DEFAULT_RESERVATION_TAB,
    TABS,
} from '@/features/reservation/constants/ReservationTab';
import { useReservationList } from '@/features/reservation/hooks/useReservationList';

export function ReservationListBody() {
    const [selectedTab, setSelectedTab] = useState<ReservationTabKey>(
        DEFAULT_RESERVATION_TAB,
    );
    const { activeReservations, pastReservations } = useReservationList();

    const filteredReservations =
        selectedTab === 'ACTIVE' ? activeReservations : pastReservations;

    return (
        <>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
                <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                <div className="bg-primary/8 flex gap-6 rounded-3xl p-2">
                    <div className="flex w-full items-center">
                        {TABS.map((tab) => (
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
                                {tab.key === 'ACTIVE' ? (
                                    <CiCalendar />
                                ) : (
                                    <RiGroupLine />
                                )}
                                {tab.label}
                                {`(${tab.key === 'ACTIVE' ? activeReservations?.length : pastReservations?.length})`}
                            </button>
                        ))}
                    </div>
                </div>
                {filteredReservations && filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => {
                        return (
                            <ReservationSelectItem
                                key={reservation.purchaseId}
                                details={reservation}
                            />
                        );
                    })
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
