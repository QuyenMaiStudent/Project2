import React from 'react';
import TreeNode from './TreeNode';
import type { Province } from '@/hooks/useLocations';

export default function TreeView({
  tree,
  onSelect,
  onEdit,
  onDelete,
  onCreateDistrict,
  onCreateWard,
}: {
  tree: Province[];
  onSelect: (t: any, i: any) => void;
  onEdit: (t: any, i: any) => void;
  onDelete: (t: any, i: any) => void;
  onCreateDistrict: (provinceId: number) => void;
  onCreateWard: (districtId: number) => void;
}) {
  if (!tree.length) return <div className="text-gray-500 text-center py-8">Không có dữ liệu</div>;
  return (
    <div>
      {tree.map(p => (
        <TreeNode
          key={p.id}
          province={p}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onCreateDistrict={onCreateDistrict}
          onCreateWard={onCreateWard}
        />
      ))}
    </div>
  );
}
