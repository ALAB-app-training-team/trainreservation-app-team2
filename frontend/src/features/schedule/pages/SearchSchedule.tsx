import { Suspense } from "react";
import { SearchScheduleBody } from "../components/SearchScheduleBody/SearchScheduleBody";
import { SearchScheduleBodySkeleton } from "../components/SearchScheduleBody/SearchScheduleBodySkeleton";
import { QrCode } from "../../reservation/components/Qrcode";

export function SearchSchedule() {
  return (
    <>
      <Suspense fallback={<SearchScheduleBodySkeleton />}>
        <SearchScheduleBody />
        <QrCode
          train_car_type_name="はやぶさ"
          train_car_number="1"
          seat_number="1"
          seat_column="A"
          code_token="QR-VUEAF6"
          code_token_text="QR-VUEAF6"
        />
      </Suspense>
    </>
  );
}
