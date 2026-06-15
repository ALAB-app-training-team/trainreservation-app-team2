import { Suspense } from "react";
import { SearchScheduleBody } from "../components/SearchScheduleBody/SearchScheduleBody";
import { SearchScheduleBodySkeleton } from "../components/SearchScheduleBody/SearchScheduleBodySkeleton";

export function SearchSchedule() {
  return (
    <>
      <Suspense fallback={<SearchScheduleBodySkeleton />}>
        <SearchScheduleBody />
      </Suspense>
    </>
  );
}
