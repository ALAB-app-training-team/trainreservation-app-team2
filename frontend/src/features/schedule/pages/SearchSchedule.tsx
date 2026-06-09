import { useSearchRequestDto } from "../hooks/useSearchRequestDto";

export function SearchSchedule() {
  const { setTime, setDate, searchRequestDto } = useSearchRequestDto();
  return (
    <>
      <div>新幹線をさがす</div>
    </>
  );
}
