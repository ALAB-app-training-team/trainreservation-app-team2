import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const isDeparted = (date: string, time: string): boolean => {
    const departure = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm:ss', true);
    return departure.isValid() && departure.isBefore(dayjs());
};
