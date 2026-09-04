import Select from 'react-select';

type SeatTypeAndPassengersSelectProps = {
    seatType: string;
    passengers: string;
    onSeatTypeChange: (seatType: string) => void;
    onPassengersChange: (passengers: string) => void;
};

export function SeatTypeAndPassengersSelect({
    seatType,
    passengers,
    onSeatTypeChange,
    onPassengersChange,
}: SeatTypeAndPassengersSelectProps) {
    const seatTypeOptions = [
        { value: '-', label: '-' },
        { value: '指定席', label: '指定席' },
        { value: 'グリーン車', label: 'グリーン車' },
        { value: 'グランクラス', label: 'グランクラス' },
    ];

    const passengerOptions = [
        { value: '-', label: '-' },
        ...[1, 2, 3, 4, 5, 6].map((num) => ({
            value: String(num),
            label: `${num}人`,
        })),
    ];

    const selectedSeatType = seatTypeOptions.find(
        (opt) => opt.value === seatType,
    );
    const selectedPassengers = passengerOptions.find(
        (opt) => opt.value === passengers,
    );

    return (
        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex w-full flex-col items-start gap-2">
                <label htmlFor="seatType">座席種別</label>
                <Select
                    inputId="seatType"
                    data-testid="seatType-select"
                    aria-label="座席種別"
                    value={selectedSeatType}
                    onChange={(option) => {
                        if (option) onSeatTypeChange(option.value);
                    }}
                    className="w-full text-left"
                    classNames={{
                        control: ({ isFocused }) =>
                            'cursor-pointer rounded-xl bg-white p-2 ' +
                            `${isFocused ? 'border-primary border-2' : 'border-transparent'}`,
                        input: () => 'cursor-pointer',
                        menu: () => 'bg-white p-2',
                        option: ({ isFocused, isSelected }) =>
                            `!cursor-pointer ${isSelected ? 'bg-primary text-white' : isFocused && 'bg-primary-light'}`,
                    }}
                    unstyled
                    options={seatTypeOptions}
                />
            </div>
            <div className="flex w-full flex-col items-start gap-2">
                <label htmlFor="passengers">人数</label>
                <Select
                    inputId="passengers"
                    data-testid="passengers-select"
                    aria-label="人数"
                    value={selectedPassengers}
                    onChange={(option) => {
                        if (option) onPassengersChange(option.value);
                    }}
                    className="w-full text-left"
                    classNames={{
                        control: ({ isFocused }) =>
                            'cursor-pointer rounded-xl bg-white p-2 ' +
                            `${isFocused ? 'border-primary border-2' : 'border-transparent'}`,
                        input: () => 'cursor-pointer',
                        menu: () => 'bg-white p-2',
                        option: ({ isFocused, isSelected }) =>
                            `!cursor-pointer ${isSelected ? 'bg-primary text-white' : isFocused && 'bg-primary-light'}`,
                    }}
                    unstyled
                    options={passengerOptions}
                />
            </div>
        </div>
    );
}
