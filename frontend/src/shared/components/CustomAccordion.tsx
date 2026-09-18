import { type ReactNode, useState } from 'react';
import { IoCaretDown, IoCaretForward } from 'react-icons/io5';

type AccordionProps = {
    title: string;
    count?: number;
    children: ReactNode;
};

export function CustomAccordion({ title, count, children }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="text-left">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2"
            >
                <span className="text-primary-ink size-4">
                    {isOpen ? <IoCaretDown /> : <IoCaretForward />}
                </span>
                <span className="text-base">{title}</span>
                {count !== undefined && (
                    <span className="border-primary-mid-light text-primary-ink bg-surface rounded-full border px-2 py-0.5 text-xs">
                        {count}件
                    </span>
                )}
            </button>
            {isOpen && <div>{children}</div>}
        </div>
    );
}
