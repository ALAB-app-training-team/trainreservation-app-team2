import type { IconType } from 'react-icons';

type FacilityIconProps = {
    icon: IconType;
    label: string;
    isDecorative?: boolean;
    iconClassName?: string;
};

export function FacilityIcon(props: FacilityIconProps) {
    const { label, isDecorative = false, iconClassName = '' } = props;

    const icon = (
        <span
            role={isDecorative ? undefined : 'img'}
            aria-label={isDecorative ? undefined : label}
            aria-hidden={isDecorative || undefined}
            className="inline-flex shrink-0 cursor-not-allowed items-center justify-center"
        >
            <props.icon className={`size-8 ${iconClassName}`} />
        </span>
    );

    if (isDecorative) {
        return icon;
    }

    return (
        <span className="group relative inline-flex">
            {icon}
            <span
                aria-hidden
                className="bg-fg text-page pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
                {label}
            </span>
        </span>
    );
}
