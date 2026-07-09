import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

type seatProps = {
    seat?: SeatResponseDto;
    onClick?: (seat: SeatResponseDto) => void;
    disabled?: boolean;
    type: 'unreservable' | 'isSelected' | 'reservable';
};

export function Seat({ seat, onClick, disabled, type }: seatProps) {
    const styles = {
        reserveModeStyle: 'w-12 h-12 rounded-lg',
        nonReserveModeStyle: 'w-8 h-8 rounded-md !cursor-default',
        unreservable: '!cursor-not-allowed border-none bg-gray-200',
        isSelected: 'cursor-pointer border-none bg-primary text-white',
        reservable: 'cursor-pointer border-2 border-primary-light',
    };

    return (
        <>
            {seat && onClick ? (
                <button
                    onClick={() => {
                        onClick(seat);
                    }}
                    className={`${styles['reserveModeStyle']} ${styles[type]}`}
                    disabled={disabled}
                >
                    {seat.seatNumber + seat.seatColumn}
                </button>
            ) : (
                <div
                    className={`${styles['nonReserveModeStyle']} ${styles[type]}`}
                />
            )}
        </>
    );
}
