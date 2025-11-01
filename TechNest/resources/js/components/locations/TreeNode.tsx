import React from 'react';
import type { Province, District, Ward } from '@/hooks/useLocations';

type NodeClick = (type: 'province'|'district'|'ward', item: any) => void;

export default function TreeNode({
  province,
  onSelect,
  onEdit,
  onDelete,
  onCreateDistrict,
  onCreateWard,
}: {
  province: Province;
  onSelect: NodeClick;
  onEdit: NodeClick;
  onDelete: NodeClick;
  onCreateDistrict: (provinceId: number) => void;
  onCreateWard: (districtId: number) => void;
}) {
  return (
    <div className="mb-3 border rounded-lg p-3">
      <div className="flex justify-between items-center bg-blue-50 p-2 rounded">
        <div className="cursor-pointer flex-1" onClick={() => onSelect('province', province)}>
          <strong className="text-blue-700">{province.name}</strong>
          <div className="text-xs text-gray-500">{province.code || ''}</div>
          {province.latitude && province.longitude && (
            <div className="text-xs text-green-600">📍 {province.latitude}, {province.longitude}</div>
          )}
        </div>
        <div className="flex gap-1">
          <button className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600" onClick={() => onCreateDistrict(province.id)}>+ Quận</button>
          <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => onEdit('province', province)}>Sửa</button>
          <button className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600" onClick={() => onDelete('province', province)}>Xóa</button>
        </div>
      </div>

      <div className="pl-4 mt-2">
        {province.districts.map(d => (
          <div key={d.id} className="mb-2 border-l-2 border-gray-200 pl-3">
            <div className="flex justify-between items-center bg-green-50 p-2 rounded">
              <div className="cursor-pointer flex-1" onClick={() => onSelect('district', {...d, province_id: province.id})}>
                <span className="font-medium text-green-700">{d.name}</span>
                <div className="text-xs text-gray-500">{d.code || ''}</div>
                {d.latitude && d.longitude && (
                  <div className="text-xs text-green-600">📍 {d.latitude}, {d.longitude}</div>
                )}
              </div>
              <div className="flex gap-1">
                <button className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600" onClick={() => onCreateWard(d.id)}>+ Phường</button>
                <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => onEdit('district', {...d, province_id: province.id})}>Sửa</button>
                <button className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600" onClick={() => onDelete('district', d)}>Xóa</button>
              </div>
            </div>

            <div className="pl-4 mt-1">
              {d.wards.map(w => (
                <div key={w.id} className="flex justify-between items-center text-sm p-1 hover:bg-yellow-50 rounded">
                  <div className="cursor-pointer flex-1" onClick={() => onSelect('ward', {...w, district_id: d.id})}>
                    <span>{w.name}</span>
                    {w.latitude && w.longitude && (
                      <div className="text-xs text-green-600">📍 {w.latitude}, {w.longitude}</div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button className="px-1 py-0.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => onEdit('ward', {...w, district_id: d.id})}>Sửa</button>
                    <button className="px-1 py-0.5 text-xs bg-red-500 text-white rounded hover:bg-red-600" onClick={() => onDelete('ward', w)}>Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}