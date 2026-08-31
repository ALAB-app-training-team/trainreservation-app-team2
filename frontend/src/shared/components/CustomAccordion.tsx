import type { ReactNode } from 'react';

type AccordionProps = {
    title: string;
    children: ReactNode;
};

export function CustomAccordion({ title, children }: AccordionProps) {
    return (
        <details>
            <summary>
                <span>{title}</span>
                <span aria-hidden="true" />
            </summary>
            <div>{children}</div>
        </details>
    );
}
