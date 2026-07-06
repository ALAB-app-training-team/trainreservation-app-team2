import { FormatTime } from '@/shared/utils/FormatTime';

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
    return (
        <>
            <div className="flex w-full flex-col items-start gap-2">
                <label htmlFor={id}>{title}</label>
                <label className="text-2xl font-bold" htmlFor={id}>
                    {FormatTime(time)}
                </label>
                <label className="text-xl font-bold" htmlFor={id}>
                    {station}
                </label>
                {getFieldError?.(id) && (
                    <p className="text-left text-sm text-red-600">
                        {getFieldError(id)}
                    </p>
                )}
            </div>
        </>
    );
}
