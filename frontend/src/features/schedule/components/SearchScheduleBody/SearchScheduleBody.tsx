import { DepartureDateAndTimePicker } from "../DepartureDateAndTimePicker";
import { useSearchRequestDto } from "../../hooks/useSearchRequestDto";

export function SearchScheduleBody() {
  const {
    setTime,
    setDate,
    setDepartureStation,
    setArrivalStation,
    searchRequestDto,
  } = useSearchRequestDto();

const 

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full m-8">
          <div className="flex flex-col justify-between border-2 border-primary-light rounded-2xl p-8 gap-4">
            <h1 className="text-left !text-3xl !m-0">新幹線をさがす</h1>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex flex-col gap-2 w-full items-start">
                <label htmlFor="date">乗車駅</label>
                <input
                  id="departureStation"
                  type=
                  className="w-full bg-white p-2 rounded-xl outline-none border-2 border-transparent focus:border-primary-light"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />{/* input,selectlist, datalistを調べて乗車駅・降車駅を実装する */}
                <select>
                    
                </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <DepartureDateAndTimePicker
                id="date"
                label="出発日"
                type="date"
                value={searchRequestDto.date}
                setValue={setDate}
              />
              <DepartureDateAndTimePicker
                id="time"
                label="出発時刻"
                type="time"
                value={searchRequestDto.time}
                setValue={setTime}
              />
            </div>
            <button>列車を検索</button>{/* SearchResultにNavigateする（検索条件をstateで渡す） */}
          </div>
        </div>
      </div>
    </>
  );
}
