import React from "react";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function BrandIndex() {
  const { brands }: any = usePage().props;

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      router.delete(route("admin.brands.destroy", id));
    }
  };

  const toggleStatus = (id: number) => {
  router.visit(route("admin.brands.toggle", id), {
    preserveScroll: true,
    preserveState: false,
  });
};


  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý thương hiệu</h1>
        <a
          href={route("admin.brands.create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          + Thêm thương hiệu
        </a>
      </div>

      <table className="w-full border border-gray-700 text-center">
        <thead className="bg-gray-800 text-gray-200">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Tên thương hiệu</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands?.data?.map((b: any, i: number) => (
            <tr key={b.id} className="border-b border-gray-700">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{b.name}</td>
              <td className="p-2">
                <button
                  onClick={() => toggleStatus(b.id)}
                  className={`px-2 py-1 rounded ${
                    b.status ? "bg-green-600" : "bg-gray-500"
                  }`}
                >
                  {b.status ? "Hiện" : "Ẩn"}
                </button>
              </td>
              <td className="p-2">
                <a
                  href={route("admin.brands.edit", b.id)}
                  className="bg-yellow-500 text-black px-3 py-1 rounded mr-2"
                >
                  Sửa
                </a>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
