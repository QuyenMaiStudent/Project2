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
            <div className="rounded border border-dashed p-6 text-base text-muted-foreground">
                Bạn chưa có gói vận chuyển nào.
            </div>
        );
    }

    return (
        <div className="rounded border p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-base md:text-lg font-medium uppercase text-primary">Trạng thái</p>
                    <p className="mt-1 text-2xl md:text-3xl font-extrabold">{status.status}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm md:text-base text-muted-foreground">Gia hạn</p>
                    <p className="mt-1 text-base md:text-lg font-medium">{status.auto_renew ? "Tự động" : "Thủ công"}</p>
                </div>
            </div>
            <div className="mt-6 text-base space-y-2">
                <p>Hạn: <span className="font-medium">{status.expires_at ? new Date(status.expires_at).toLocaleString("vi-VN") : "N/A"}</span></p>
                <p>Phí đã thanh toán: <span className="font-semibold">{(status.price / 100).toLocaleString("vi-VN")}₫</span></p>
            </div>
        </div>
    );
};

export default PackageSubscriptionStatus;