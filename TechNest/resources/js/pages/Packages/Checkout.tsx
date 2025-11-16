import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft } from "lucide-react";
import axios from 'axios';
import { useState } from 'react';

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

  const { data, setData, post } = useForm({
    gateway: gateways[0],
    coupon: "",
  });

  const [processing, setProcessing] = useState(false);

  const formatCurrency = (v?: number) =>
    v == null ? "-" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await axios.post(`/packages/${pkg.id}/pay`, {
        gateway: data.gateway,
        coupon: data.coupon,
      });
      const url = res?.data?.redirect_url;
      if (url) {
        window.location.href = url; // direct navigation -> no CORS
      } else {
        // hiển thị lỗi
        alert(res?.data?.message || 'Không nhận được URL thanh toán');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tạo yêu cầu thanh toán');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Gói vận chuyển", href: "/packages" }, { title: "Thanh toán", href: `/packages/${pkg.id}/checkout` }]}>
      <Head title={`Thanh toán — ${pkg?.name ?? ""}`} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
            <h1 className="text-2xl font-semibold">Thanh toán gói: {pkg?.name}</h1>
          </div>
          <span className="text-sm text-gray-600">{formatCurrency(pkg?.price)}</span>
        </div>

        <div className="bg-white shadow rounded-lg p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium mb-2">Chi tiết gói</h2>
            <p className="text-sm text-gray-700 mb-4">{pkg?.description ?? "-"}</p>

            <ul className="space-y-2 mb-4">
              {(pkg?.features ?? []).map((f, i) => (
                <li key={i} className="text-sm text-gray-600">
                  • {f}
                </li>
              ))}
            </ul>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                <div className="space-y-2">
                  {gateways.map((g) => (
                    <label key={g} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="gateway"
                        value={g}
                        checked={data.gateway === g}
                        onChange={(e) => setData("gateway", e.target.value)}
                        className="form-radio"
                      />
                      <span className="text-sm capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá (tuỳ chọn)</label>
                <input
                  type="text"
                  name="coupon"
                  value={data.coupon}
                  onChange={(e) => setData("coupon", e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Nhập mã giảm giá"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-700">
                  <div>Thời hạn: {pkg?.duration_days ?? "-" } ngày</div>
                  <div className="font-semibold mt-1">{formatCurrency(pkg?.price)}</div>
                </div>

                <div className="flex items-center space-x-3">
                  <LinkBack />
                  <Button type="submit" disabled={processing}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Thanh toán
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <aside className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Tóm tắt đơn</h3>
            <div className="text-sm text-gray-700 mb-2">Gói: {pkg?.name}</div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Giá gốc</span>
              <span className="font-medium">{formatCurrency(pkg?.price)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">Giảm</span>
              <span className="font-medium">-</span>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between items-center">
              <span className="text-sm">Tổng thanh toán</span>
              <span className="text-lg font-semibold">{formatCurrency(pkg?.price)}</span>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

function LinkBack() {
  return (
    <a href="/packages" className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
      Quay lại
    </a>
  );
}
