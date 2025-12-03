<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Province;
use App\Models\ShippingAddress;
use App\Models\Ward;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ShippingAddressController extends Controller
{
    use AuthorizesRequests;

    /**
     * Hiển thị danh sách địa chỉ giao hàng
     */
    public function index()
    {
        $addresses = ShippingAddress::where('user_id', Auth::id())
            ->with(['province', 'ward'])
            ->latest()
            ->paginate(10)
            ->through(function (ShippingAddress $address) {
                return [
                    'id' => $address->id,
                    'recipient_name' => $address->recipient_name,
                    'phone' => $address->phone,
                    'address_line' => $address->address_line,
                    'province_code' => $address->province_code,
                    'province_name' => optional($address->province)->name,
                    'ward_code' => $address->ward_code,
                    'ward_name' => optional($address->ward)->name,
                    'latitude' => $address->latitude,
                    'longitude' => $address->longitude,
                    'is_default' => (bool) $address->is_default,
                    'full_address' => $this->formatFullAddress($address),
                ];
            });

        $provinces = Province::orderBy('name')->get(['code', 'name']);
        $wards = Ward::orderBy('name')->get(['code', 'name', 'province_code']);

        return Inertia::render('Customer/ShippingAddress/Index', [
            'addresses' => $addresses,
            'provinces' => $provinces,
            'wards' => $wards,
            'mapsApiKey' => config('services.google_maps.api_key'),
        ]);
    }

    /**
     * Hiển thị form thêm mới
     */
    public function create()
    {
        return Inertia::render('Customer/ShippingAddress/Create');
    }

    /**
     * Lưu địa chỉ giao hàng mới
     */
    public function store(Request $request)
    {
        $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line' => 'required|string|max:255',
            'province_code' => 'required|string|exists:provinces,code',
            'ward_code' => 'required|string|exists:wards,code',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_default' => 'boolean',
        ]);

        $ward = Ward::where('code', $request->ward_code)->first();
        if ($ward && $ward->province_code !== $request->province_code) {
            return back()->withErrors([
                'ward_code' => 'Phường/Xã không thuộc tỉnh/thành đã chọn.',
            ]);
        }

        //Nếu đổi địa chỉ mặc định, bỏ mặc định các địa chỉ khác
        if ($request->is_default) {
            ShippingAddress::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        ShippingAddress::create([
            'user_id' => Auth::id(),
            'recipient_name' => $request->recipient_name,
            'phone' => $request->phone,
            'address_line' => $request->address_line,
            'province_code' => $request->province_code,
            'ward_code' => $request->ward_code,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'is_default' => $request->is_default ?? false,
        ]);

        return redirect()->route('shipping_addresses.index')
            ->with('success', 'Đã thêm địa chỉ giao hàng mới!');
    }

    /**
     * Hiển thị form chỉnh sửa
     */
    public function edit(ShippingAddress $shippingAddress)
    {
        $this->authorize('update', $shippingAddress);

        return Inertia::render('Customer/ShippingAddress/Edit', [
            'address' => $shippingAddress,
        ]);
    }

    /**
     * Cập nhật địa chỉ giao hàng
     */
    public function update(Request $request, ShippingAddress $shippingAddress)
    {
        $this->authorize('update', $shippingAddress);

        $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line' => 'required|string|max:255',
            'province_code' => 'required|string|exists:provinces,code',
            'ward_code' => 'required|string|exists:wards,code',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_default' => 'boolean',
        ]);

        $ward = Ward::where('code', $request->ward_code)->first();
        if ($ward && $ward->province_code !== $request->province_code) {
            return back()->withErrors([
                'ward_code' => 'Phường/Xã không thuộc tỉnh/thành đã chọn.',
            ]);
        }

        if ($request->is_default) {
            ShippingAddress::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        $shippingAddress->update([
            'recipient_name' => $request->recipient_name,
            'phone' => $request->phone,
            'address_line' => $request->address_line,
            'province_code' => $request->province_code,
            'ward_code' => $request->ward_code,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'is_default' => $request->is_default ?? false,
        ]);

        return redirect()->route('shipping_addresses.index')
            ->with('success', 'Đã cập nhật địa chỉ giao hàng!');
    }

    /**
     * Xóa địa chỉ giao hàng
     */
    public function destroy(ShippingAddress $shippingAddress)
    {
        $this->authorize('delete', $shippingAddress);

        $shippingAddress->delete();

        return redirect()->route('shipping_addresses.index')
            ->with('success', 'Đã xóa địa chỉ giao hàng!');
    }

    private function formatFullAddress(ShippingAddress $address): string
    {
        $parts = [
            $address->address_line,
            optional($address->ward)->name,
            optional($address->province)->name,
        ];

        return implode(', ', array_filter($parts));
    }
}
