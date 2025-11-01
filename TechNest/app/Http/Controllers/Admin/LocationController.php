<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Province;
use App\Models\District;
use App\Models\Ward;

class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/LocationTest');
    }

    // =========================
    // 1. TỈNH / THÀNH PHỐ
    // =========================
    public function listProvinces()
    {
        $provinces = Province::orderBy('name')->get();
        return response()->json($provinces);
    }

    public function createProvince()
    {
        return response()->json(['message' => 'Trang tạo tỉnh/thành']);
    }

    public function storeProvince(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:provinces,code'
        ]);

        $province = Province::create($request->only('name', 'code'));

        return response()->json([
            'message' => 'Thêm Tỉnh/Thành phố thành công',
            'data' => $province
        ]);
    }

    public function updateProvince(Request $request, $id)
    {
        $province = Province::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:provinces,code,' . $province->id
        ]);

        $province->update($request->only('name', 'code'));

        return response()->json([
            'message' => 'Cập nhật Tỉnh/Thành phố thành công',
            'data' => $province
        ]);
    }

    public function deleteProvince($id)
    {
        Province::destroy($id);
        return response()->json(['message' => 'Xóa Tỉnh/Thành phố thành công']);
    }

    // =========================
    // 2. QUẬN / HUYỆN
    // =========================
    public function listDistricts($provinceId)
    {
        $districts = District::where('province_id', $provinceId)
            ->orderBy('name')
            ->get();

        return response()->json($districts);
    }

    public function createDistrict($provinceId)
    {
        return response()->json(['message' => "Trang tạo quận/huyện cho tỉnh $provinceId"]);
    }

    public function storeDistrict(Request $request, $provinceId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:districts,code'
        ]);

        $district = District::create([
            'name' => $request->name,
            'code' => $request->code,
            'province_id' => $provinceId
        ]);

        return response()->json([
            'message' => 'Thêm Quận/Huyện thành công',
            'data' => $district
        ]);
    }

    public function updateDistrict(Request $request, $id)
    {
        $district = District::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:districts,code,' . $district->id
        ]);

        $district->update($request->only('name', 'code'));

        return response()->json([
            'message' => 'Cập nhật Quận/Huyện thành công',
            'data' => $district
        ]);
    }

    public function deleteDistrict($id)
    {
        District::destroy($id);
        return response()->json(['message' => 'Xóa Quận/Huyện thành công']);
    }

    // =========================
    // 3. PHƯỜNG / XÃ
    // =========================
    public function listWards($districtId)
    {
        $wards = Ward::where('district_id', $districtId)
            ->orderBy('name')
            ->get();

        return response()->json($wards);
    }

    public function createWard($districtId)
    {
        return response()->json(['message' => "Trang tạo phường/xã cho quận $districtId"]);
    }

    public function storeWard(Request $request, $districtId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:wards,code'
        ]);

        $ward = Ward::create([
            'name' => $request->name,
            'code' => $request->code,
            'district_id' => $districtId
        ]);

        return response()->json([
            'message' => 'Thêm Phường/Xã thành công',
            'data' => $ward
        ]);
    }

    public function updateWard(Request $request, $id)
    {
        $ward = Ward::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:wards,code,' . $ward->id
        ]);

        $ward->update($request->only('name', 'code'));

        return response()->json([
            'message' => 'Cập nhật Phường/Xã thành công',
            'data' => $ward
        ]);
    }

    public function deleteWard($id)
    {
        Ward::destroy($id);
        return response()->json(['message' => 'Xóa Phường/Xã thành công']);
    }
}
