export function ScheduleListSkeleton() {
    return (
        <>
            <div className="flex min-h-32 w-full flex-col gap-4 rounded-2xl">
                <svg className="bg-surface-disabled h-32 w-full animate-pulse rounded-lg md:h-full" />
                <svg className="bg-surface-disabled h-32 w-full animate-pulse rounded-lg md:h-full" />
                <svg className="bg-surface-disabled h-32 w-full animate-pulse rounded-lg md:h-full" />
            </div>
        </>
    );
}
