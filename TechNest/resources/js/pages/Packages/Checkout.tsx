import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft } from "lucide-react";
import axios from "axios";

type PackageItem = {
  id: number;
  name: string;
  description?: string;
  price?: number;
  duration_days?: number;
  features?: string[];
  is_active?: boolean;
};

interface PageProps {
  package: PackageItem;
  gateways?: string[];
  [key: string]: any;
}

export default function Checkout() {
  const { props } = usePage<PageProps>();
  const pkg = props.package;
  const gateways = props.gateways ?? ["stripe", "paypal", "momo", "vnpay"];

  const { data, setData } = useForm({ gateway: gateways[0] });
  const [processing, setProcessing] = useState(false);

  const formatCurrency = (v?: number) =>
    v == null ? "-" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await axios.post(`/packages/${pkg.id}/pay`, { gateway: data.gateway });
      const url = res?.data?.redirect_url;
      if (url) window.location.href = url;
      else alert(res?.data?.message || "Không nhận được URL thanh toán");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo yêu cầu thanh toán");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Gói vận chuyển", href: "/packages" },
        { title: "Thanh toán", href: `/packages/${pkg.id}/checkout` },
      ]}
    >
      <Head title={`Thanh toán — ${pkg?.name ?? ""}`} />

      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top header card */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-md bg-[#0AC1EF] text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Thanh toán gói: {pkg?.name}</h1>
                <p className="text-sm text-slate-500 mt-1">{pkg?.duration_days ?? "-"} ngày • {pkg?.features?.length ?? 0} tính năng</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Tổng phải trả</div>
              <div className="inline-flex items-center gap-3">
                <div className="text-2xl font-extrabold text-slate-900">{formatCurrency(pkg?.price)}</div>
                <span className="px-3 py-1 rounded-full bg-[#0AC1EF] text-white text-sm font-semibold">Thanh toán</span>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Chi tiết gói</h2>
                  <p className="text-sm text-slate-500 mt-1">{pkg?.description ?? "-"}</p>
                </div>
                <Link href="/packages" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                </Link>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(pkg?.features ?? []).map((f, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-3 bg-slate-50 rounded-md p-3">
                    <div className="w-2 h-2 mt-1 bg-[#0AC1EF] rounded-full" />
                    <div>{f}</div>
                  </li>
                ))}
              </ul>

              <div>
                <h3 className="text-md font-medium mb-2">Chọn phương thức thanh toán</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {gateways.map((g) => {
                    const selected = data.gateway === g;
                    return (
                      <label
                        key={g}
                        className={`cursor-pointer rounded-lg border px-3 py-3 flex items-center justify-center text-sm font-medium gap-2 ${
                          selected ? "border-[#0AC1EF] bg-[#f0fbff] shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gateway"
                          value={g}
                          checked={selected}
                          onChange={(e) => setData("gateway", e.target.value)}
                          className="sr-only"
                        />
                        <div className="uppercase tracking-wider text-xs">{g.replace(/_/g, " ")}</div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-sm text-slate-600">
                  <div>Thời hạn gói: <span className="font-medium text-slate-800">{pkg?.duration_days ?? "-" } ngày</span></div>
                  <div className="mt-1 text-xs text-slate-400">Gói sẽ kích hoạt sau khi thanh toán thành công.</div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button type="submit" disabled={processing} className="inline-flex items-center bg-[#0AC1EF] hover:bg-[#09b3db] text-white">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {processing ? "Đang xử lý..." : "Thanh toán ngay"}
                  </Button>
                </div>
              </div>
            </div>

            <aside className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Tóm tắt đơn</h3>
                <div className="text-sm text-slate-500">{pkg?.duration_days ?? "-"} ngày</div>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Gói</span>
                  <span className="font-medium">{pkg?.name}</span>
                </div>

                <div className="flex justify-between">
                  <span>Giá</span>
                  <span className="font-medium">{formatCurrency(pkg?.price)}</span>
                </div>

                {/* removed discount row per request */}

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-sm font-medium">Tổng thanh toán</span>
                  <div className="text-lg font-bold text-[#0AC1EF]">{formatCurrency(pkg?.price)}</div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Hỗ trợ: vui lòng liên hệ bộ phận CSKH nếu cần trợ giúp.
              </div>
            </aside>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
