import type { SetStateAction } from "react";

type DepartureDateAndTimePickerProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  getFieldError?: (field: string) => string;
};

export function DepartureDateAndTimePicker({
  id,
  label,
  type,
  value,
  setValue,
  getFieldError,
}: DepartureDateAndTimePickerProps) {
  return (
    <div className="flex flex-col gap-2 w-full items-start">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-white p-2 rounded-xl outline-none border-2 border-primary-light cursor-pointer focus:border-primary"
      />
      {getFieldError?.(id) && (
        <p className="text-left text-sm text-red-600 ">{getFieldError(id)}</p>
      )}
    </div>
  );
}
