import axios from "axios";

export async function fetchLocationsTree() {
    const r = await axios.get('/admin/api/locations/tree');
    return r.data;
}

/* Province */
export async function createProvince(payload: any) {
    return axios.post('/admin/api/provinces', payload);
}
export async function updateProvince(id: number, payload: any) {
    return axios.put(`/admin/api/provinces/${id}`, payload);
}
export async function deleteProvince(id: number) {
    return axios.delete(`/admin/api/provinces/${id}`);
}

/* District */
export async function createDistrict(payload: any) {
    return axios.post('/admin/api/districts', payload);
}
export async function updateDistrict(id: number, payload: any) {
    return axios.put(`/admin/api/districts/${id}`, payload);
}
export async function deleteDistrict(id: number) {
    return axios.delete(`/admin/api/districts/${id}`);
}

/* Ward */
export async function createWard(payload: any) {
    return axios.post('/admin/api/wards', payload);
}
export async function updateWard(id: number, payload: any) {
    return axios.put(`/admin/api/wards/${id}`, payload);
}
export async function deleteWard(id: number) {
    return axios.delete(`/admin/api/wards/${id}`);
}