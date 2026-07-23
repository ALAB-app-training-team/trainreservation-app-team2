import { PiTrainBold } from 'react-icons/pi';
import { tv } from 'tailwind-variants';

import { TRAIN_TYPE_COLOR } from '@/shared/constants/TrainTypeColor';

const trainIconStyle = tv({
    base: 'flex justify-center items-center w-8 h-8 p-0.5 text-2xl rounded-md text-white',
    variants: {
        color: {
            primary: 'bg-primary',
            YM: 'bg-YM',
            HB: 'bg-HB',
            NS: 'bg-NS',
            HT: 'bg-HT',
            KM: 'bg-KM',
            TB: 'bg-TB',
            TK: 'bg-TK',
            TN: 'bg-TN',
            KK: 'bg-KK',
            AS: 'bg-AS',
        },
    },
    defaultVariants: {
        color: 'primary',
    },
});

type TrainIconProps = {
    trainTypeName?: string;
};

export function TrainIcon({ trainTypeName }: TrainIconProps) {
    const prefixName = trainTypeName ? trainTypeName.split(/(\d+)/)[0] : '';
    const foundColor = TRAIN_TYPE_COLOR.find(
        (item) => item.trainTypeName === prefixName,
    );

    const colorCd = (foundColor?.colorCd ||
        'primary') as keyof typeof trainIconStyle.variants.color;

    return (
        <div className={trainIconStyle({ color: colorCd })}>
            <PiTrainBold />
        </div>
    );
}
