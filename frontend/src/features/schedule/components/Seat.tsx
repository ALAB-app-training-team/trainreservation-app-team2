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
        unreservable: {
            visual: ' border-none bg-gray-200',
            cursor: '!cursor-not-allowed',
        },
        isSelected: {
            visual: 'border-none bg-primary text-white',
            cursor: 'cursor-pointer',
        },
        reservable: {
            visual: ' border-2 border-primary-light',
            cursor: 'cursor-pointer',
        },
    };

    return (
        <>
            {seat && onClick ? (
                <button
                    onClick={() => {
                        onClick(seat);
                    }}
                    className={`${styles['reserveModeStyle']} ${styles[type].visual} ${styles[type].cursor}`}
                    disabled={disabled}
                    data-testid={
                        type === 'reservable' ? 'empty-seat' : undefined
                    }
                >
                    {seat.seatNumber + seat.seatColumn}
                </button>
            ) : (
                <div
                    className={`${styles['nonReserveModeStyle']} ${styles[type].visual}`}
                />
            )}
        </>
    );
}
