import { type ReactNode, useState } from 'react';

type AccordionProps = {
    title: string;
    children: ReactNode;
};

export function CustomAccordion({ title, children }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <details>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-gray-900"
            >
                <summary>
                    <span>{title}</span>
                    <span aria-hidden="true" />
                </summary>{' '}
                <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
                <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
                    {children}
                </div>
            )}
        </details>
    );
}
