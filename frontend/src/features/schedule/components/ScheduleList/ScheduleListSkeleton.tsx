export function ScheduleListSkeleton() {
    return (
        <>
            <div className="flex min-h-32 w-full flex-col gap-4 rounded-2xl">
                <svg className="h-full w-full animate-pulse rounded-lg bg-gray-300" />
                <svg className="h-full w-full animate-pulse rounded-lg bg-gray-300" />
                <svg className="h-full w-full animate-pulse rounded-lg bg-gray-300" />
            </div>
        </>
    );
}
