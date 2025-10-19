import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function EditBrand() {
  const { brand }: any = usePage().props;
  const [name, setName] = useState(brand.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(route("admin.brands.update", brand.id), { name });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-2xl mb-4">Chỉnh sửa thương hiệu</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên thương hiệu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <button
          type="submit"
          className="ml-3 bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-400"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}
