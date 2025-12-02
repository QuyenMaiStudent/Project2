import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent, ReactNode, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { PackageItem } from "@/components/packages/PackageCard";
import { Switch } from "@headlessui/react";

interface AdminPackage extends PackageItem {
    is_active: boolean;
}

interface Props {
    packages: AdminPackage[];
}

type PackageForm = {
    name: string;
    description: string;
    price: number;
    duration_days: number;
    is_active: boolean;
    features: string[];
};

const splitFeatures = (features: string) =>
    features
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

const ManagePackages = ({ packages }: Props) => {
    // editing removed — only allow creating new package
    const [featuresInput, setFeaturesInput] = useState<string>("");

    const defaultValues: PackageForm = {
        name: "",
        description: "",
        price: 99000,
        duration_days: 30,
        is_active: true,
        features: [],
    };

    const { data, setData, post, reset, processing, errors } = useForm<PackageForm>(defaultValues);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // only create
        post("/admin/packages", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setFeaturesInput("");
            },
        });
    };

    return (
        <>
            <Head title="Quản lý gói dịch vụ" />

            <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="space-y-6 max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">Quản lý gói dịch vụ</h1>
                        <p className="text-base md:text-lg text-slate-500 mt-2">
                            Tạo, bật/tắt và theo dõi các gói dịch vụ dành cho khách hàng.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
                        <div className="rounded-lg border border-slate-200 bg-white shadow-lg">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h2 className="text-xl md:text-2xl font-semibold">Tạo gói mới</h2>
                            </div>
                            <div className="px-6 py-6">
                                <form onSubmit={submit} className="space-y-4 text-base md:text-lg">
                                    <div className="space-y-1">
                                        <label htmlFor="name" className="text-base md:text-lg font-semibold text-slate-700">
                                            Tên gói
                                        </label>
                                        <input
                                            id="name"
                                            className="w-full rounded border border-slate-300 px-4 py-3 text-base md:text-lg focus:border-[#0AC1EF] focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                            value={data.name}
                                            onChange={(event) => setData("name", event.target.value)}
                                            placeholder="VD: Gói Premium"
                                        />
                                        {errors.name && <p className="text-base md:text-lg text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="price" className="text-base md:text-lg font-semibold text-slate-700">
                                            Giá (VNĐ)
                                        </label>
                                        <input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full rounded border border-slate-300 px-4 py-3 text-base md:text-lg focus:border-[#0AC1EF] focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                            value={data.price ?? 0}
                                            onChange={(event) => setData("price", Number(event.target.value) || 0)}
                                            placeholder="99000"
                                        />
                                        {errors.price && <p className="text-base md:text-lg text-red-500">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="duration_days" className="text-base md:text-lg font-semibold text-slate-700">
                                            Số ngày hiệu lực
                                        </label>
                                        <input
                                            id="duration_days"
                                            type="number"
                                            min="1"
                                            className="w-full rounded border border-slate-300 px-4 py-3 text-base md:text-lg focus:border-[#0AC1EF] focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                            value={data.duration_days ?? 1}
                                            onChange={(event) =>
                                                setData("duration_days", Number(event.target.value) || 1)
                                            }
                                            placeholder="30"
                                        />
                                        {errors.duration_days && (
                                            <p className="text-base md:text-lg text-red-500">{errors.duration_days}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="description" className="text-base md:text-lg font-semibold text-slate-700">
                                            Mô tả
                                        </label>
                                        <textarea
                                            id="description"
                                            className="h-28 w-full rounded border border-slate-300 px-4 py-3 text-base md:text-lg focus:border-[#0AC1EF] focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                            value={data.description ?? ""}
                                            onChange={(event) => setData("description", event.target.value)}
                                            placeholder="Mô tả ngắn về gói..."
                                        />
                                        {errors.description && (
                                            <p className="text-base md:text-lg text-red-500">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="features" className="text-base md:text-lg font-semibold text-slate-700">
                                            Tính năng (mỗi dòng một mục)
                                        </label>
                                        <textarea
                                            id="features"
                                            className="w-full rounded border border-slate-300 px-4 py-3 text-base md:text-lg focus:border-[#0AC1EF] focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                            value={featuresInput}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setFeaturesInput(value);
                                                setData("features", splitFeatures(value));
                                            }}
                                            placeholder={"• Hỗ trợ ưu tiên\n• Miễn phí vận chuyển"}
                                            rows={6}
                                        />
                                        <p className="text-sm md:text-base text-slate-500">
                                            Những điểm nổi bật sẽ được hiển thị cho khách hàng.
                                        </p>
                                        {errors.features && <p className="text-base md:text-lg text-red-500">{errors.features}</p>}
                                    </div>

                                    <div className="rounded border border-slate-200 px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-base md:text-lg font-semibold text-slate-700">Kích hoạt gói</p>
                                                <p className="text-sm md:text-base text-slate-500">
                                                    Cho phép khách hàng nhìn thấy và đăng ký gói này.
                                                </p>
                                            </div>
                                            <Switch
                                                checked={data.is_active}
                                                onChange={(checked) => setData("is_active", checked)}
                                                className={`${
                                                    data.is_active ? "bg-[#0AC1EF]" : "bg-slate-300"
                                                } relative inline-flex h-7 w-12 items-center rounded-full transition`}
                                            >
                                                <span
                                                    className={`${
                                                        data.is_active ? "translate-x-6" : "translate-x-1"
                                                    } inline-block h-5 w-5 transform rounded-full bg-white transition`}
                                                />
                                            </Switch>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-[#0AC1EF] px-6 py-3 text-base md:text-lg font-medium text-white hover:bg-[#09b3db] disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
                                    >
                                        Tạo gói mới
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white shadow-lg">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h2 className="text-xl md:text-2xl font-semibold">Danh sách gói</h2>
                            </div>
                            <div className="px-6 py-6 space-y-4">
                                {packages.map((pkg) => (
                                    <div key={pkg.id} className="rounded border border-slate-200 p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-semibold text-base md:text-lg text-slate-800">{pkg.name}</p>
                                                <p className="text-base md:text-lg text-slate-500">
                                                    {Number(pkg.price).toLocaleString("vi-VN")}₫ · {pkg.duration_days} ngày
                                                </p>
                                                {pkg.features?.length ? (
                                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-base md:text-lg text-slate-500">
                                                        {pkg.features.slice(0, 3).map((feature, index) => (
                                                            <li key={`${pkg.id}-feature-${index}`}>{feature}</li>
                                                        ))}
                                                        {pkg.features.length > 3 && <li>…</li>}
                                                    </ul>
                                                ) : null}
                                            </div>
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm md:text-base font-medium ${
                                                    pkg.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                {pkg.is_active ? "Đang mở" : "Đang tắt"}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {/* Edit removed */}
                                            <button
                                                className="rounded-lg border border-slate-300 px-4 py-2 text-base md:text-lg text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => router.post(`/admin/packages/${pkg.id}/toggle`)}
                                            >
                                                {pkg.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

ManagePackages.layout = (page: ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Dashboard", href: "/admin/dashboard" },
            { title: "Gói dịch vụ", href: "/admin/packages" },
        ]}
    >
        {page}
    </AppLayout>
);

export default ManagePackages;