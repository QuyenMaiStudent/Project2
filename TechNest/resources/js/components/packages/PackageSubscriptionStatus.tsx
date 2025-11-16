interface Props {
    status?: {
        id: number;
        status: string;
        expires_at: string | null;
        auto_renew: boolean;
        price: number;
    } | null;
}

const PackageSubscriptionStatus = ({ status }: Props) => {
    if (!status) {
        return (
            <div className="rounded border border-dashed p-4 text-sm text-muted-foreground">
                Bạn chưa có gói vận chuyển nào.
            </div>
        );
    }

    return (
        <div className="rounded border p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium uppercase text-primary">Trạng thái</p>
                    <p className="text-lg font-semibold">{status.status}</p>
                </div>
                <div>
                    <p className="text-sx text-muted-foreground">Gia hạn</p>
                    <p className="text-sm font-medium">{status.auto_renew ? "Tự động" : "Thủ công"}</p>
                </div>
            </div>
            <div className="mt-4 text-sm">
                <p>Hạn: {status.expires_at ? new Date(status.expires_at).toLocaleString("vi-VN") : "N/A"}</p>
                <p>Phí đã thanh toán: {(status.price / 100).toLocaleString("vi-VN")}₫</p>
            </div>
        </div>
    );
};

export default PackageSubscriptionStatus;