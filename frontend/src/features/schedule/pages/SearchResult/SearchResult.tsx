import { Suspense, useState } from "react";
import { ScheduleList } from "../../components/ScheduleList/ScheduleList";
import { ScheduleListSkeleton } from "../../components/ScheduleList/ScheduleListSkeleton";

export function SearchResult() {
  // TODO: 検索画面ができたら、useLocationで取り出すようにする
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [departureStation, setDepartureStation] = useState<string>("");
  const [arrivalStation, setArrivalStation] = useState<string>("");

  return (
    <>
      <div>こんちゃっちゃー</div>
      <Suspense fallback={<ScheduleListSkeleton />}>
        <ScheduleList
          time={time}
          date={date}
          departureStation={departureStation}
          arrivalStation={arrivalStation}
        />
      </Suspense>
    </>
  );
}
