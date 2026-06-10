import type { SetStateAction } from "react";
import type { Station } from "../types/Station";

type StationSelectProps = {
  id: string;
  label: string;
  list: Station[];
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
};

export function StationSelect({
  id,
  label,
  list,
  value,
  setValue,
}: StationSelectProps) {
  return (
    <>
      <div className="flex flex-col gap-2 w-full items-start">
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {list.map((item, index) => {
            return (
              <option key={index} value={item.name}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}
