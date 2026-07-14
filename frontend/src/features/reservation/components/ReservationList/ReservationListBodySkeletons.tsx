import { CiCalendar } from 'react-icons/ci';
import { RiGroupLine } from 'react-icons/ri';

export function ReservationListBodySkeleton() {
    return (
        <>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
                <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                <div className="bg-primary/8 flex gap-6 rounded-3xl p-2">
                    <button className="flex w-full items-center justify-center gap-2 rounded-3xl bg-white px-6 py-2 font-bold shadow transition">
                        <CiCalendar />- （-）
                    </button>
                    <button className="flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-2 transition">
                        <RiGroupLine />- （-）
                    </button>
                </div>
                <svg className="w-full animate-pulse rounded-2xl bg-gray-300" />
            </div>
        </>
    );
}
