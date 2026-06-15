import type { SetStateAction } from "react";
import type { Station } from "../types/Station";

type StationSelectProps = {
  id: string;
  label: string;
  list: Station[];
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  getFieldError?: (field: string) => string;
};

export function StationSelect({
  id,
  label,
  list,
  value,
  setValue,
  getFieldError: getFieldError,
}: StationSelectProps) {
  return (
    <>
      <div className="flex flex-col gap-2 w-full items-start">
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-primary-light p-2 rounded-xl outline-none border-2 border-transparent focus:border-primary"
        >
          {list.map((item, index) => {
            return (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            );
          })}
        </select>
        {getFieldError?.(id) && (
          <p className="text-left text-sm text-red-600 ">{getFieldError(id)}</p>
        )}
      </div>
    </>
  );
}
