import { useState } from 'react';
import { BsShare } from 'react-icons/bs';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';
import { toast } from 'sonner';

import { CustomModal } from '@/shared/components/CustomModal';

interface TicketShareProps {
    shareUrl: string;
}

export function TicketShare({ shareUrl = '' }: TicketShareProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleClose = () => setIsOpen(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('リンクのコピーに失敗しました');
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary flex h-full w-full items-center justify-center gap-2 rounded-xl p-2 text-sm text-white"
                data-testid="ticket-share"
            >
                <BsShare className="h-4 w-4" />
                <div>チケットを共有</div>
            </button>

            <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                <div className="relative">
                    <h3 className="text-fg mb-2 text-lg font-bold">
                        チケットを共有
                    </h3>
                    <div className="text-fg-secondary mb-4 text-sm">
                        以下のリンクをコピーして共有できます
                    </div>
                    <div className="border-line bg-surface-subtle flex items-center gap-2 rounded-lg border p-2">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="text-fg-secondary flex-1 overflow-hidden bg-transparent px-2 text-sm text-ellipsis whitespace-nowrap outline-none"
                        />
                        <button
                            onClick={handleCopy}
                            className="bg-primary flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-white"
                            data-testid="link-copy"
                        >
                            {copied ? (
                                <>
                                    <IoCheckmarkOutline className="h-4 w-4" />
                                    <div>コピー完了</div>
                                </>
                            ) : (
                                <>
                                    <IoCopyOutline className="h-4 w-4" />
                                    <div>コピー</div>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </CustomModal>
        </>
    );
}
