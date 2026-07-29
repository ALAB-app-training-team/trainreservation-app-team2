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
        } catch (error) {
            console.log('Failed to copy the link', error);
            toast.error('リンクのコピーに失敗しました');
        }
    };

    return (
        <div className="mx-auto mt-4 w-full max-w-xl">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm text-white"
            >
                <BsShare className="h-4 w-4" />
                <div>チケットを共有</div>
            </button>

            <CustomModal isOpen={isOpen} onRequestClose={handleClose}>
                <div className="relative">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                        チケットを共有
                    </h3>
                    <div className="mb-4 text-sm text-gray-600">
                        以下のリンクをコピーして共有できます
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="flex-1 overflow-hidden bg-transparent px-2 text-sm text-ellipsis whitespace-nowrap text-gray-700 outline-none"
                        />
                        <button
                            onClick={handleCopy}
                            className="bg-primary flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-white"
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
        </div>
    );
}
