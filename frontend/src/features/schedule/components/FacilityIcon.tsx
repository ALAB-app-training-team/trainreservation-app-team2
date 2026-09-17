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
            className={`inline-flex size-8 shrink-0 items-center justify-center rounded-md border-2 ${frameClassName}`}
        >
            <props.icon className={`size-7 ${iconClassName}`} />
        </span>
    );
}
