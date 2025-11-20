import { Head, useForm, usePage } from '@inertiajs/react';
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
        <AppLayout>
            <Head title="Vị trí cửa hàng" />

            <div className="mx-auto max-w-4xl space-y-6 py-6">
                <div>
                    <h1 className="text-2xl font-semibold">Vị trí cửa hàng</h1>
                    <p className="text-sm text-gray-600">
                        Cập nhật vị trí để khách hàng thấy khoảng cách giao hàng chính xác hơn.
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tên cửa hàng
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                placeholder="VD: TechNest Hà Nội"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Địa chỉ hiển thị
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={data.formatted_address}
                                onChange={(event) =>
                                    setData('formatted_address', event.target.value)
                                }
                                placeholder="Tự động cập nhật khi chọn trên bản đồ"
                            />
                            {errors.formatted_address && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.formatted_address}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Ghi chú thêm (tùy chọn)
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={data.address_line}
                                onChange={(event) => setData('address_line', event.target.value)}
                                placeholder="VD: Tầng 5, tòa nhà ABC"
                            />
                            {errors.address_line && (
                                <p className="mt-1 text-xs text-red-600">{errors.address_line}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <MapLibreMapPicker
                            lat={coords.lat}
                            lng={coords.lng}
                            onLocationChange={(lat, lng, formatted) => {
                                setData('latitude', lat.toString());
                                setData('longitude', lng.toString());
                                if (formatted) {
                                    setData('formatted_address', formatted);
                                }
                            }}
                        />

                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Tọa độ hiện tại:</span>{' '}
                            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                        </div>

                        {(errors.latitude || errors.longitude) && (
                            <p className="text-xs text-red-600">
                                {errors.latitude ?? errors.longitude}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={processing}
                        >
                            {processing ? 'Đang lưu...' : 'Lưu vị trí'}
                        </button>
                    </div>
                </form>

                {store && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold">Thông tin hiện tại</h2>
                        <dl className="mt-3 space-y-2 text-sm text-gray-700">
                            <div className="flex gap-2">
                                <dt className="w-32 font-medium text-gray-500">Tên:</dt>
                                <dd>{store.name ?? '—'}</dd>
                            </div>
                            <div className="flex gap-2">
                                <dt className="w-32 font-medium text-gray-500">Địa chỉ:</dt>
                                <dd>{store.formatted_address ?? '—'}</dd>
                            </div>
                            <div className="flex gap-2">
                                <dt className="w-32 font-medium text-gray-500">Ghi chú:</dt>
                                <dd>{store.address_line ?? '—'}</dd>
                            </div>
                            <div className="flex gap-2">
                                <dt className="w-32 font-medium text-gray-500">Tọa độ:</dt>
                                <dd>
                                    {store.latitude?.toFixed(6) ?? '—'},{' '}
                                    {store.longitude?.toFixed(6) ?? '—'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}