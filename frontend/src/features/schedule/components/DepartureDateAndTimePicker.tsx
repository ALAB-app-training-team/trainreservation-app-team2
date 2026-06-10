import type { SetStateAction } from "react";

type DepartureDateAndTimePickerProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
};

export function DepartureDateAndTimePicker({
  id,
  label,
  type,
  value,
  setValue,
}: DepartureDateAndTimePickerProps) {
  return (
    <div className="flex flex-col gap-2 w-full items-start">
      <label htmlFor="date">{label}</label>
      <input
        id={id}
        type={type}
        className="w-full bg-white p-2 rounded-xl outline-none border-2 border-transparent focus:border-primary-light"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></input>
    </div>
  );
}
