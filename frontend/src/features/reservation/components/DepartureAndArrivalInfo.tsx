type DepartureAndArrivalInfoProps = {
  id: string;
  title: string;
  time: string;
  station: string;
  getFieldError?: (field: string) => string;
};

export function DepartureAndArrivalInfo({
  id,
  title,
  time,
  station,
  getFieldError: getFieldError,
}: DepartureAndArrivalInfoProps) {
  return (
    <>
      <div className="flex flex-col gap-2 w-full items-start">
        <label htmlFor={id}>{title}</label>
        <label htmlFor={id}>{time}</label>
        <label htmlFor={id}>{station}</label>
        {getFieldError?.(id) && (
          <p className="text-left text-sm text-red-600 ">{getFieldError(id)}</p>
        )}
      </div>
    </>
  );
}
