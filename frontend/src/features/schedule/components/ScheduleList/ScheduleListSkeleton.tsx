export function ScheduleListSkeleton() {
    return (
        <>
            <div className="flex min-h-32 w-full flex-col gap-4 rounded-2xl">
                <svg className="bg-surface-disabled h-full w-full animate-pulse rounded-lg" />
                <svg className="bg-surface-disabled h-full w-full animate-pulse rounded-lg" />
                <svg className="bg-surface-disabled h-full w-full animate-pulse rounded-lg" />
            </div>
        </>
    );
}
