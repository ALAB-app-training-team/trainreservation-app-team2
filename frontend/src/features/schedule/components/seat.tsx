type seatProps = {
  id?: string;
  onClick?: (id: string) => void;
  disabled?: boolean;
  type: "isReserved" | "isSelected" | "reservable";
  isReserveMode: boolean;
  name?: string;
};

export function Seat({
  id,
  onClick,
  disabled,
  type,
  isReserveMode,
  name,
}: seatProps) {
  const styles = {
    reserveModeStyle: "w-12 h-12 rounded-lg",
    nonReserveModeStyle: "w-8 h-8 rounded-md",
    isReserved: "cursor-not-allowed border-none bg-gray-200",
    isSelected: "cursor-pointer border-none bg-primary text-white",
    reservable: "cursor-pointer border-2 border-primary-light",
  };

  return (
    <>
      {isReserveMode ? (
        <button
          onClick={() => {
            if (onClick && id) {
              onClick(id);
            }
          }}
          className={`${styles["reserveModeStyle"]} ${styles[type]}`}
          disabled={disabled}
        >
          {name}
        </button>
      ) : (
        <div className={`${styles["nonReserveModeStyle"]} ${styles[type]}`} />
      )}
    </>
  );
}
