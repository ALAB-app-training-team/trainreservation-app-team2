import { Suspense } from "react";

import { ReservationListBody } from "../components/ReservationList/ReservationListBody";
import { ReservationListBodySkeleton } from "../components/ReservationList/ReservationListBodySkeletons";

export function ReservationList() {
  return (
    <>
      <Suspense fallback={<ReservationListBodySkeleton />}>
        <ReservationListBody />
      </Suspense>
    </>
  );
}
