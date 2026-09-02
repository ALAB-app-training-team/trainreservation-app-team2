import { type ReactNode, useState } from 'react';
import { IoCaretDown, IoCaretForward } from 'react-icons/io5';

type AccordionProps = {
    title: string;
    children: ReactNode;
};

export function CustomAccordion({ title, children }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="text-left">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2"
            >
                <span className="size-4">
                    {isOpen ? <IoCaretDown /> : <IoCaretForward />}
                </span>
                <span>{title}</span>
            </button>
            {isOpen && <div>{children}</div>}
        </div>
    );
}
