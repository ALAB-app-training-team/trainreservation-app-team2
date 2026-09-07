export function ScheduleListSkeleton() {
    return (
        <>
            <div className="flex min-h-32 w-full flex-col gap-4 rounded-2xl">
                <svg className="h-32 w-full animate-pulse rounded-lg bg-gray-300 md:h-full" />
                <svg className="h-32 w-full animate-pulse rounded-lg bg-gray-300 md:h-full" />
                <svg className="h-32 w-full animate-pulse rounded-lg bg-gray-300 md:h-full" />
            </div>
        </>
    );
}
