<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Province;
use App\Models\Ward;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageLocationController extends Controller
{
    // Return admin view (SPA will fetch data)
    public function index()
    {
        return Inertia::render('Admin/Locations/LocationsTree');
    }

    //Return nested tree: provinces -> districts -> wards
    public function tree()
    {
        $provinces = Province::with(['districts.wards'])->orderBy('name')->get();
        return response()->json($provinces);
    }

    // Province CRUD
    public function storeProvince(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:provinces,code',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        Province::create($data);
        return redirect()->route('admin.locations.index')->with('success', 'Tạo tỉnh/thành phố thành công.');
    }

    public function updateProvince(Request $request, Province $province)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:provinces,code,' . $province->id,
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        $province->update($data);
        return redirect()->route('admin.locations.index')->with('success', 'Cập nhật tỉnh/thành phố thành công.');
    }

    public function destroyProvince(Province $province)
    {
        $province->delete();
        return redirect()->route('admin.locations.index')->with('success', 'Xóa tỉnh/thành phố thành công.');
    }

    //District CRUD
    public function storeDistrict(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:districts,code',
            'province_id' => 'required|exists:provinces,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        return redirect()->route('admin.locations.index')->with('success', 'Tạo quận/huyện thành công.');
    }

    public function updateDistrict(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:districts,code,',
            'province_id' => 'required|exists:provinces,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        return redirect()->route('admin.locations.index')->with('success', 'Cập nhật quận/huyện thành công.');
    }

    public function destroyDistrict()
    {
        return redirect()->route('admin.locations.index')->with('success', 'Xóa quận/huyện thành công.');
    }

    // Ward CRUD
    public function storeWard(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:wards,code',
            'district_id' => 'required|exists:districts,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        Ward::create($data);
        return redirect()->route('admin.locations.index')->with('success', 'Tạo phường/xã thành công.');
    }

    public function updateWard(Request $request, Ward $ward)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:wards,code,' . $ward->id,
            'district_id' => 'required|exists:districts,id',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        $ward->update($data);
        return redirect()->route('admin.locations.index')->with('success', 'Cập nhật phường/xã thành công.');
    }

    public function destroyWard(Ward $ward)
    {
        $ward->delete();
        return redirect()->route('admin.locations.index')->with('success', 'Xóa phường/xã thành công.');
    }
}
