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
                        <button className="flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-2 transition">
                            <CiCalendar />
                            {RESERVATION_TAB[0].label}(0)
                        </button>
                        <button className="flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-2 transition">
                            <RiGroupLine />
                            {RESERVATION_TAB[1].label}(0)
                        </button>
                        <button className="flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-2 transition">
                            <LuTicket />
                            {RESERVATION_TAB[2].label}(0)
                        </button>
                    </div>
                </div>
                <svg className="h-76 animate-pulse rounded-2xl bg-gray-300 sm:w-full" />
                <svg className="h-76 animate-pulse rounded-2xl bg-gray-300 sm:w-full" />
            </div>
        </>
    );
}
