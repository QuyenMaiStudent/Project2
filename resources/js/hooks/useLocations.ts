import { useCallback, useEffect, useState } from 'react';
import * as api from '@/api/locations';

export type Ward = { id: number; name: string; latitude?: number | null; longitude?: number | null; code?: string };
export type District = { id: number; name: string; code?: string; latitude?: number | null; longitude?: number | null; wards: Ward[] };
export type Province = { id: number; name: string; code?: string; latitude?: number | null; longitude?: number | null; districts: District[] };

export function useLocations() {
  const [tree, setTree] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.fetchLocationsTree();
      setTree(data || []);
    } catch (e: any) {
      setError(e?.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createP = async (payload: any) => { await api.createProvince(payload); await load(); };
  const updateP = async (id: number, payload: any) => { await api.updateProvince(id, payload); await load(); };
  const deleteP = async (id: number) => { await api.deleteProvince(id); await load(); };

  const createD = async (payload: any) => { await api.createDistrict(payload); await load(); };
  const updateD = async (id: number, payload: any) => { await api.updateDistrict(id, payload); await load(); };
  const deleteD = async (id: number) => { await api.deleteDistrict(id); await load(); };

  const createW = async (payload: any) => { await api.createWard(payload); await load(); };
  const updateW = async (id: number, payload: any) => { await api.updateWard(id, payload); await load(); };
  const deleteW = async (id: number) => { await api.deleteWard(id); await load(); };

  return {
    tree, loading, error, reload: load,
    createP, updateP, deleteP,
    createD, updateD, deleteD,
    createW, updateW, deleteW,
  };
}