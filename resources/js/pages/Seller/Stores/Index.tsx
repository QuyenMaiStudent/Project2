import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';
import MapLibreMapPicker from '@/components/MapLibrMapPicker';
import AppLayout from '@/layouts/app-layout';

interface SellerStore {
    id: number;
    seller_id: number;
    name: string | null;
    formatted_address: string | null;
    address_line: string | null;
    latitude: number | null;
    longitude: number | null;
}

interface Props {
    store: SellerStore | null;
    fallback: {
        latitude: number;
        longitude: number;
    };
}

export default function Index({ store, fallback }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string } };

    const initialLatitude = store?.latitude ?? fallback.latitude;
    const initialLongitude = store?.longitude ?? fallback.longitude;

    const { data, setData, post, processing, errors } = useForm({
        name: store?.name ?? '',
        formatted_address: store?.formatted_address ?? '',
        address_line: store?.address_line ?? '',
        latitude: initialLatitude.toString(),
        longitude: initialLongitude.toString(),
    });

    const coords = useMemo(() => {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return { lat, lng };
        }

        return { lat: fallback.latitude, lng: fallback.longitude };
    }, [data.latitude, data.longitude, fallback.latitude, fallback.longitude]);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/seller/store/location', { preserveScroll: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' },
                { title: 'Vị trí cửa hàng', href: '/seller/store' },
            ]}
        >
            <Head title="Vị trí cửa hàng" />

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    <header className="mb-4 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Vị trí cửa hàng</h1>
                                <p className="text-base md:text-lg text-slate-500">
                                    Cập nhật vị trí để khách hàng thấy khoảng cách giao hàng chính xác hơn.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/seller/store"
                                    className="inline-flex items-center rounded-md border border-gray-200 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Làm mới
                                </Link>
                            </div>
                        </div>
                    </header>

                    {flash?.success && (
                        <div className="rounded-md bg-green-50 border border-green-100 p-4 text-base md:text-lg text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3">
                        <form
                            onSubmit={submit}
                            className="lg:col-span-2 space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Tên cửa hàng</label>
                                    <input
                                        type="text"
                                        className="mt-2 w-full rounded border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                        placeholder="VD: TechNest Hà Nội"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ hiển thị</label>
                                    <input
                                        type="text"
                                        className="mt-2 w-full rounded border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.formatted_address}
                                        onChange={(event) => setData('formatted_address', event.target.value)}
                                        placeholder="Tự động cập nhật khi chọn trên bản đồ"
                                    />
                                    {errors.formatted_address && (
                                        <p className="mt-1 text-xs text-red-600">{errors.formatted_address}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Ghi chú thêm (tùy chọn)</label>
                                    <input
                                        type="text"
                                        className="mt-2 w-full rounded border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.address_line}
                                        onChange={(event) => setData('address_line', event.target.value)}
                                        placeholder="VD: Tầng 5, tòa nhà ABC"
                                    />
                                    {errors.address_line && <p className="mt-1 text-xs text-red-600">{errors.address_line}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Tọa độ hiện tại</label>
                                    <div className="mt-1 flex items-center gap-3">
                                        <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3 text-base md:text-lg">
                                            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                                        </div>
                                        <button
                                            type="button"
                                            className="rounded bg-white border border-gray-300 px-4 py-3 text-base hover:bg-gray-50"
                                            onClick={() => {
                                                setData('latitude', fallback.latitude.toString());
                                                setData('longitude', fallback.longitude.toString());
                                            }}
                                        >
                                            Đặt về mặc định
                                        </button>
                                    </div>
                                    {(errors.latitude || errors.longitude) && (
                                        <p className="mt-1 text-xs text-red-600">{errors.latitude ?? errors.longitude}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-base md:text-lg text-slate-500">Chọn vị trí trên bản đồ hoặc nhập tọa độ thủ công.</p>
                                <div className="rounded overflow-hidden border border-gray-200">
                                    <div className="h-[420px] md:h-[560px] lg:h-[680px]">
                                        <MapLibreMapPicker
                                            lat={coords.lat}
                                            lng={coords.lng}
                                            height={680} /* pass explicit large height to the picker */
                                            onLocationChange={(lat, lng, formatted) => {
                                                setData('latitude', lat.toString());
                                                setData('longitude', lng.toString());
                                                if (formatted) setData('formatted_address', formatted);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-6 py-3 text-base md:text-lg font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                                    disabled={processing}
                                >
                                    {processing ? 'Đang lưu...' : 'Lưu vị trí'}
                                </button>
                            </div>
                        </form>

                        <aside className="space-y-6">
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl md:text-2xl font-semibold">Thông tin hiện tại</h2>
                                <dl className="mt-4 space-y-3 text-base md:text-lg text-gray-700">
                                    <div className="flex gap-2">
                                        <dt className="w-28 font-medium text-gray-500">Tên</dt>
                                        <dd>{store?.name ?? '—'}</dd>
                                    </div>
                                    <div className="flex gap-2">
                                        <dt className="w-28 font-medium text-gray-500">Địa chỉ</dt>
                                        <dd>{store?.formatted_address ?? '—'}</dd>
                                    </div>
                                    <div className="flex gap-2">
                                        <dt className="w-28 font-medium text-gray-500">Ghi chú</dt>
                                        <dd>{store?.address_line ?? '—'}</dd>
                                    </div>
                                    <div className="flex gap-2">
                                        <dt className="w-28 font-medium text-gray-500">Tọa độ</dt>
                                        <dd>
                                            {store?.latitude?.toFixed(6) ?? '—'},{' '}
                                            {store?.longitude?.toFixed(6) ?? '—'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="text-base text-gray-500 mb-2">Hướng dẫn</h3>
                                <ul className="text-base text-gray-600 space-y-3 list-disc pl-6">
                                    <li>Kéo thả hoặc nhấp vào bản đồ để chọn vị trí chính xác.</li>
                                    <li>Địa chỉ hiển thị sẽ tự động điền khi chọn trên bản đồ.</li>
                                    <li>Nhập ghi chú để khách hàng dễ tìm hơn (tầng, cửa, cổng).</li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}