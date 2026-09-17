import type { IconType } from 'react-icons';

type FacilityIconProps = {
    icon: IconType;
    label: string;
    frameClassName?: string;
    iconClassName?: string;
};

export function FacilityIcon(props: FacilityIconProps) {
    const {
        label,
        frameClassName = 'border-line-strong',
        iconClassName = '',
    } = props;

    return (
        <span
            role="img"
            aria-label={label}
            className={`inline-flex size-12 cursor-not-allowed items-center justify-center rounded-md border-2 ${frameClassName}`}
        >
            <props.icon className={`size-7 ${iconClassName}`} />
        </span>
    );
}
