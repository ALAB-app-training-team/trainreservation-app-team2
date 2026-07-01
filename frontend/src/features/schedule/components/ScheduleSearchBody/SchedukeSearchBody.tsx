import { Suspense } from "react";
import { ScheduleList } from "../ScheduleList/ScheduleList";
import { useSearchRequestDto } from "../../hooks/useSearchRequestDto";
import { useStations } from "../../hooks/useStations";
import { SearchScheduleForm } from "../SearchScheduleForm";
import { ScheduleListSkeleton } from "../ScheduleList/ScheduleListSkeleton";

export function ScheduleSearchBody() {
  const { stations } = useStations();
  const {
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
    isInvalid,
    getFieldError,
  } = useSearchRequestDto({ stations });

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-4 mx-8 my-4">
          <SearchScheduleForm
            stations={stations}
            setTime={setTime}
            setDate={setDate}
            setDepartureStation={setDepartureStation}
            setArrivalStation={setArrivalStation}
            searchRequestDto={searchRequestDto}
            getFieldError={getFieldError}
          />
          <Suspense fallback={<ScheduleListSkeleton />}>
            <ScheduleList
              key={JSON.stringify(searchRequestDto)}
              searchRequestDto={searchRequestDto}
              isInvalid={isInvalid}
              departureStationCd={searchRequestDto.departure_station_cd}
              departureStationName={
                stations.find(
                  (station) =>
                    station.station_cd ===
                    searchRequestDto.departure_station_cd,
                )?.name || "エラー"
              }
              arrivalStationCd={searchRequestDto.arrival_station_cd}
              arrivalStationName={
                stations.find(
                  (station) =>
                    station.station_cd === searchRequestDto.arrival_station_cd,
                )?.name || "エラー"
              }
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
