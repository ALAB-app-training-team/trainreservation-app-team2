import { CiCalendar } from 'react-icons/ci';
import { LuTicket } from 'react-icons/lu';
import { RiGroupLine } from 'react-icons/ri';

import { RESERVATION_TAB } from '@/features/reservation/constants/ReservationTab';

export function ReservationListBodySkeleton() {
    return (
        <>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
                <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                <div className="bg-primary/8 flex gap-6 rounded-3xl p-2">
                    <div className="flex w-full items-center">
                        <button className="flex w-full flex-col items-center justify-center gap-1 rounded-3xl px-6 py-2 transition sm:flex-row sm:gap-2">
                            <CiCalendar />
                            <span className="flex flex-col items-center whitespace-nowrap sm:flex-row">
                                <span>{RESERVATION_TAB[0].label}</span>
                                <span>(0)</span>
                            </span>
                        </button>
                        <button className="flex w-full flex-col items-center justify-center gap-1 rounded-3xl px-6 py-2 transition sm:flex-row sm:gap-2">
                            <RiGroupLine />
                            <span className="flex flex-col items-center whitespace-nowrap sm:flex-row">
                                <span>{RESERVATION_TAB[1].label}</span>
                                <span>(0)</span>
                            </span>
                        </button>
                        <button className="flex w-full flex-col items-center justify-center gap-1 rounded-3xl px-6 py-2 transition sm:flex-row sm:gap-2">
                            <LuTicket />
                            <span className="flex flex-col items-center whitespace-nowrap sm:flex-row">
                                <span>{RESERVATION_TAB[2].label}</span>
                                <span>(0)</span>
                            </span>
                        </button>
                    </div>
                </div>
                <svg className="w-full animate-pulse rounded-2xl bg-gray-300" />
            </div>
        </>
    );
}
