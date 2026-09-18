import type { SeatDto } from '@/features/schedule/types/SeatDto';
import type { RovingItemProps } from '@/shared/hooks/useRovingFocus';

type seatProps = {
    seat?: SeatDto;
    onClick?: (seat: SeatDto) => void;
    disabled?: boolean;
    type: 'unreservable' | 'isSelected' | 'reservable';
    /** 座席グリッド内を矢印キーで移動するための roving tabindex 用 props */
    itemProps?: RovingItemProps;
};

export function Seat({ seat, onClick, disabled, type, itemProps }: seatProps) {
    const styles = {
        reserveModeStyle: 'w-12 h-12 rounded-lg lg:w-16 lg:h-16',
        nonReserveModeStyle: 'w-8 h-8 rounded-md !cursor-default',
        unreservable: {
            visual: ' border-none bg-surface-inset',
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
                    {...itemProps}
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
