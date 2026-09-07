import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

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
    dayjs.extend(customParseFormat);
    return (
        <>
            <div className="flex w-full flex-col items-start gap-2">
                <label htmlFor={id}>{title}</label>
                <label className="text-2xl font-bold" htmlFor={id}>
                    {dayjs(time, 'HH:mm:ss').format('HH:mm')}
                </label>
                <label className="text-xl font-bold" htmlFor={id}>
                    {station}
                </label>
                {getFieldError?.(id) && (
                    <p className="text-danger text-left text-sm">
                        {getFieldError(id)}
                    </p>
                )}
            </div>
        </>
    );
}
