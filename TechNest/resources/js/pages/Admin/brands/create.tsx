import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function CreateBrand() {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(route("admin.brands.store"), { name });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-2xl mb-4">Thêm thương hiệu</h1>
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
          className="ml-3 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Lưu
        </button>
      </form>
    </div>
  );
}
