import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSearchRequestDto } from "../../hooks/useSearchRequestDto";
import { useStations } from "../../hooks/useStations";
import { DepartureDateAndTimePicker } from "../DepartureDateAndTimePicker";
import { StationSelect } from "../StationSelect";

export function SearchScheduleBody() {
  const navigate = useNavigate();
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

  const handleSearch = () => {
    navigate("/searchResult", {
      state: {
        dto: searchRequestDto,
        departure_station_name: stations.find(
          (s) => s.station_cd === searchRequestDto.departure_station_cd,
        )?.name,
        arrival_station_name: stations.find(
          (s) => s.station_cd === searchRequestDto.arrival_station_cd,
        )?.name,
      },
    });
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col gap-4 m-8">
          <div className="flex flex-col justify-between border-2 border-primary-light rounded-2xl p-8 gap-4">
            <h1 className="text-left !text-3xl !m-0">新幹線をさがす</h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <StationSelect
                id="departureStation"
                label="乗車駅"
                list={stations}
                value={searchRequestDto.departure_station_cd}
                setValue={setDepartureStation}
              />
              <div className="hidden md:block text-xl mt-4">
                <FiArrowRight />
              </div>
              <StationSelect
                id="arrivalStation"
                label="降車駅"
                list={stations}
                value={searchRequestDto.arrival_station_cd}
                setValue={setArrivalStation}
                getFieldError={getFieldError}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <DepartureDateAndTimePicker
                id="date"
                label="出発日"
                type="date"
                value={searchRequestDto.date}
                setValue={setDate}
                getFieldError={getFieldError}
              />
              <DepartureDateAndTimePicker
                id="time"
                label="出発時刻"
                type="time"
                value={searchRequestDto.time}
                setValue={setTime}
                getFieldError={getFieldError}
              />
            </div>
            <button
              disabled={isInvalid}
              onClick={handleSearch}
              className="rounded-lg p-2 bg-primary text-white"
            >
              列車を検索
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
