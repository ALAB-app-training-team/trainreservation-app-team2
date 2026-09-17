import type { IconType } from 'react-icons';

type FacilityIconProps = {
    icon: IconType;
    label: string;
    isDecorative?: boolean;
    frameClassName?: string;
    iconClassName?: string;
};

export function FacilityIcon(props: FacilityIconProps) {
    const {
        label,
        isDecorative = false,
        frameClassName = 'border-line-strong',
        iconClassName = '',
    } = props;

    return (
        <span
            role={isDecorative ? undefined : 'img'}
            aria-label={isDecorative ? undefined : label}
            aria-hidden={isDecorative || undefined}
            className={`inline-flex shrink-0 cursor-not-allowed items-center justify-center rounded-md ${frameClassName}`}
        >
            <props.icon className={`size-8 ${iconClassName}`} />
        </span>
    );
}
