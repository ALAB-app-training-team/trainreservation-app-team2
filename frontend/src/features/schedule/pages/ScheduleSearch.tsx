import { Suspense } from "react";
import { ScheduleSearchBody } from "../components/ScheduleSearchBody/SchedukeSearchBody";
import { ScheduleSearchBodySkeleton } from "../components/ScheduleSearchBody/ScheduleSearchBodySkeleton";
export function ScheduleSearch() {
  return (
    <>
      <Suspense fallback={<ScheduleSearchBodySkeleton />}>
        <ScheduleSearchBody />
      </Suspense>
    </>
  );
}
