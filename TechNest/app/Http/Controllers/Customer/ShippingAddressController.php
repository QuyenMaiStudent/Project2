<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\District;
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
            ->latest()
            ->paginate(10);

        $provinces = Province::orderBy('name')->get(['id', 'name']);
        $districts = District::orderBy('name')->get(['id', 'name', 'province_id']);
        $wards = Ward::orderBy('name')->get(['id', 'name', 'district_id']);

        return Inertia::render('Customer/ShippingAddress/Index', [
            'addresses' => $addresses,
            'provinces' => $provinces,
            'districts' => $districts,
            'wards' => $wards,
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
            'province_id' => 'required|integer|exists:provinces,id',
            'district_id' => 'required|integer|exists:districts,id',
            'ward_id' => 'required|integer|exists:wards,id',
            'is_default' => 'boolean',
        ]);

        //Nếu đổi địa chỉ mặc định, bỏ mặc định các địa chỉ khác
        if ($request->is_default) {
            ShippingAddress::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        ShippingAddress::create([
            'user_id' => Auth::id(),
            'recipient_name' => $request->recipient_name,
            'phone' => $request->phone,
            'address_line' => $request->address_line,
            'province_id' => $request->province_id,
            'district_id' => $request->district_id,
            'ward_id' => $request->ward_id,
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
            'province_id' => 'required|integer|exists:provinces,id',
            'district_id' => 'required|integer|exists:districts,id',
            'ward_id' => 'required|integer|exists:wards,id',
            'is_default' => 'boolean',
        ]);

        if ($request->is_default) {
            ShippingAddress::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        $shippingAddress->update([
            'recipient_name' => $request->recipient_name,
            'phone' => $request->phone,
            'address_line' => $request->address_line,
            'province_id' => $request->province_id,
            'district_id' => $request->district_id,
            'ward_id' => $request->ward_id,
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
}
