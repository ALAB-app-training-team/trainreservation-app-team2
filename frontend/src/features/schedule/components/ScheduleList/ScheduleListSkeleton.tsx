export function ScheduleListSkeleton() {
  return (
    <>
      <div className="flex flex-col w-full rounded-2xl gap-4 min-h-32">
        <svg className="w-full h-full bg-gray-300 rounded-lg animate-pulse"></svg>
        <svg className="w-full h-full bg-gray-300 rounded-lg animate-pulse"></svg>
        <svg className="w-full h-full bg-gray-300 rounded-lg animate-pulse"></svg>
      </div>
    </>
  );
}
