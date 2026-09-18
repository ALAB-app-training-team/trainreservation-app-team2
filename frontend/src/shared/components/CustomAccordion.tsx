import { type ReactNode, useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

type AccordionProps = {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
};

export function CustomAccordion({ title, icon, children }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="text-left">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="hover:bg-primary-ink/8 flex w-full items-center gap-2 rounded-lg px-2 py-1.5"
            >
                {icon && (
                    <span className="text-primary-ink shrink-0 text-lg">
                        {icon}
                    </span>
                )}
                <span className="text-left">{title}</span>
                <HiOutlineChevronDown
                    className={`text-primary-ink size-4 shrink-0 transition-transform ${
                        isOpen ? '' : '-rotate-90'
                    }`}
                />
            </button>
            {isOpen && <div>{children}</div>}
        </div>
    );
}
