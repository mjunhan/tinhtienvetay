import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface DownloadInvoiceProps {
    elementId: string;
    productName: string;
}

export function DownloadInvoice({ elementId, productName }: DownloadInvoiceProps) {
    const handleDownload = useCallback(async () => {
        const node = document.getElementById(elementId);
        if (!node) {
            toast.error("Không tìm thấy bảng giá để tải xuống");
            return;
        }

        try {
            toast.loading("Đang tạo ảnh...");

            // Filter out the download button itself from the capture if needed
            // But usually we can just hide it via CSS during capture or acceptable to include

            const dataUrl = await toPng(node, {
                cacheBust: true,
                backgroundColor: '#ffffff', // Ensure white background
                pixelRatio: 2 // High quality
            });

            const link = document.createElement('a');
            const toggleName = productName ? ` - ${productName}` : '';
            link.download = `chi-phi-uoc-tinh${toggleName}.png`;
            link.href = dataUrl;
            link.click();

            toast.dismiss();
            toast.success("Đã tải xuống ảnh báo giá!");
        } catch (err) {
            console.error(err);
            toast.dismiss();
            toast.error("Có lỗi xảy ra khi tạo ảnh.");
        }
    }, [elementId, productName]);

    return (
        <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 text-sm text-text-muted hover:text-primary transition-colors py-2"
        >
            <Download className="w-4 h-4" />
            <span>Tải ảnh báo giá</span>
        </button>
    );
}
