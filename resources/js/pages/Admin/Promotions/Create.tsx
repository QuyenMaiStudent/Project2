// @ts-nocheck
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create() {
    const page = usePage().props as any;
    const brands = page.brands ?? [];
    const products = page.products ?? [];
    const categories = page.categories ?? [];

    // only show products that are active and approved
    const availableProducts = Array.isArray(products)
        ? products.filter((p: any) => Boolean(p.is_active) && String(p.status)?.toLowerCase() === 'approved')
        : [];

    const breadcrumbs = [
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Khuyến mãi', href: '/admin/promotions' },
        { title: 'Tạo khuyến mãi', href: '/admin/promotions/create' },
    ];

    const form = useForm({
        code: '',
        type: 'fixed',
        value: '',
        description: '',
        min_order_amount: '',
        usage_limit: '',
        starts_at: '',
        expires_at: '',
        is_active: true,
        conditions: [],
        no_min_amount: false,
        no_usage_limit: false,
    });

    const [startError, setStartError] = useState<string>('');
    const [endError, setEndError] = useState<string>('');
    const [valueError, setValueError] = useState<string>('');

    // select-all states
    const [selectAllBrands, setSelectAllBrands] = useState(false);
    const [selectAllProducts, setSelectAllProducts] = useState(false);
    const [selectAllCategories, setSelectAllCategories] = useState(false);

    useEffect(() => {
        const conds = form.data.conditions || [];
        const brandIds = conds.filter((c: any) => c.condition_type === 'brand').map((c: any) => c.target_id);
        const prodIds = conds.filter((c: any) => c.condition_type === 'product').map((c: any) => c.target_id);
        const catIds = conds.filter((c: any) => c.condition_type === 'category').map((c: any) => c.target_id);

        setSelectAllBrands(brands.length > 0 && brands.every((b: any) => brandIds.includes(b.id)));
        setSelectAllProducts(availableProducts.length > 0 && availableProducts.every((p: any) => prodIds.includes(p.id)));
        setSelectAllCategories(categories.length > 0 && categories.every((c: any) => catIds.includes(c.id)));
    }, [form.data.conditions, brands, availableProducts, categories]);

    const setAllOfType = (type: string, items: any[]) => {
        const others = (form.data.conditions || []).filter((c: any) => c.condition_type !== type);
        const newConds = [...others, ...items.map((i: any) => ({ condition_type: type, target_id: i.id }))];
        form.setData('conditions', newConds);
    };

    const clearAllOfType = (type: string) => {
        form.setData(
            'conditions',
            (form.data.conditions || []).filter((c: any) => c.condition_type !== type),
        );
    };

    const validateStart = (local?: string) => {
        if (!local) {
            setStartError('');
            return true;
        }
        let s = local;
        if (s.includes(' ')) s = s.replace(' ', 'T').split(':00')[0];
        if (!s.includes('T') && s.length >= 16) s = s.slice(0, 16);
        const sel = new Date(s);
        if (Number.isNaN(sel.getTime())) {
            setStartError('Ngày/giờ không hợp lệ');
            return false;
        }
        const now = new Date();
        if (sel < now) {
            setStartError('Thời gian bắt đầu phải là hiện tại hoặc tương lai.');
            return false;
        }
        setStartError('');
        return true;
    };

    const validateEnd = (localEnd?: string, localStart?: string) => {
        if (!localEnd) {
            setEndError('');
            return true;
        }
        let e = localEnd;
        if (e.includes(' ')) e = e.replace(' ', 'T').split(':00')[0];
        if (!e.includes('T') && e.length >= 16) e = e.slice(0, 16);
        const endDate = new Date(e);
        if (Number.isNaN(endDate.getTime())) {
            setEndError('Ngày/giờ kết thúc không hợp lệ');
            return false;
        }

        if (localStart) {
            let s = localStart;
            if (s.includes(' ')) s = s.replace(' ', 'T').split(':00')[0];
            if (!s.includes('T') && s.length >= 16) s = s.slice(0, 16);
            const startDate = new Date(s);
            if (!Number.isNaN(startDate.getTime())) {
                if (endDate <= startDate) {
                    setEndError('Thời gian kết thúc phải sau thời gian bắt đầu.');
                    return false;
                }
            }
        }

        setEndError('');
        return true;
    };

    const submit = (e: any) => {
        e.preventDefault();

        const min = form.data.no_min_amount ? 0 : form.data.min_order_amount === '' ? null : form.data.min_order_amount;
        const limit = form.data.no_usage_limit ? null : form.data.usage_limit === '' ? null : form.data.usage_limit;

        const starts = form.data.starts_at ? form.data.starts_at.replace('T', ' ') + ':00' : null;
        const expires = form.data.expires_at ? form.data.expires_at.replace('T', ' ') + ':00' : null;

        if (!validateStart(form.data.starts_at as string)) return;
        if (!validateEnd(form.data.expires_at as string, form.data.starts_at as string)) return;
        if (!validateValue(form.data.value, form.data.type)) return;

        form.setData('min_order_amount', min);
        form.setData('usage_limit', limit);
        form.setData('starts_at', starts);
        form.setData('expires_at', expires);

        form.post('/admin/promotions');
    };

    const validateValue = (value: string, type: string) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            setValueError('Giá trị phải là số dương.');
            return false;
        }
        if (type === 'percent') {
            if (num > 100) {
                setValueError('Giá trị phần trăm không được vượt quá 100%.');
                return false;
            }
            if (num > 20) {
                setValueError('Khuyến nghị: Giá trị phần trăm không nên vượt quá 20% để tránh lỗ.');
                return false;
            }
        } else if (type === 'fixed') {
            if (num > 1000000) {
                setValueError('Giá trị giảm giá cố định không được vượt quá 1.000.000 VNĐ.');
                return false;
            }
        }
        setValueError('');
        return true;
    };

    const toggleCondition = (type: string, id: number) => {
        const exists = form.data.conditions.find((c: any) => c.condition_type === type && c.target_id === id);
        if (exists) {
            form.setData(
                'conditions',
                form.data.conditions.filter((c: any) => !(c.condition_type === type && c.target_id === id)),
            );
        } else {
            form.setData('conditions', [...form.data.conditions, { condition_type: type, target_id: id }]);
        }
    };

    const isSelected = (type: string, id: number) => form.data.conditions.some((c: any) => c.condition_type === type && c.target_id === id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tạo khuyến mãi" />

            <div className="mx-auto min-h-screen max-w-7xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8">
                <div className="mb-6 rounded-lg border-l-4 border-[#0AC1EF] bg-white p-6 md:p-8 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Tạo khuyến mãi</h1>
                            <p className="text-base md:text-lg text-gray-600 mt-1">Tạo mã giảm giá và quản lý điều kiện áp dụng.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/promotions" className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300 text-base md:text-lg">
                                Quay lại
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6 md:p-8 shadow-xl">
                    <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* left: main fields (2/3 width) */}
                        <div className="space-y-4 lg:col-span-2 text-base md:text-lg">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-base md:text-lg font-semibold">Mã</label>
                                    <input
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value)}
                                        className="w-full rounded border px-4 py-3 text-base md:text-lg"
                                    />
                                    {form.errors.code && <div className="mt-1 text-sm text-red-600">{form.errors.code}</div>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-base md:text-lg font-semibold">Trạng thái</label>
                                    <select
                                        value={form.data.is_active ? '1' : '0'}
                                        onChange={(e) => form.setData('is_active', e.target.value === '1')}
                                        className="w-full rounded border px-4 py-3 text-base md:text-lg"
                                    >
                                        <option value="1">Hoạt động</option>
                                        <option value="0">Tắt</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-base md:text-lg font-semibold">Loại</label>
                                    <select
                                        value={form.data.type}
                                        onChange={(e) => form.setData('type', e.target.value)}
                                        className="w-full rounded border px-4 py-3 text-base md:text-lg"
                                    >
                                        <option value="fixed">Tiền</option>
                                        <option value="percent">Phần trăm</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-base md:text-lg font-semibold">Giá trị</label>
                                    <input
                                        value={form.data.value}
                                        onChange={(e) => {
                                            form.setData('value', e.target.value);
                                            validateValue(e.target.value, form.data.type);
                                        }}
                                        className="w-full rounded border px-4 py-3 text-base md:text-lg"
                                    />
                                    {valueError && <div className="mt-1 text-sm text-red-600">{valueError}</div>}
                                    {form.errors.value && <div className="mt-1 text-sm text-red-600">{form.errors.value}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-base md:text-lg font-semibold">Mô tả</label>
                                <textarea
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    className="min-h-[120px] w-full rounded border px-4 py-3 text-base md:text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-base md:text-lg font-semibold">Giá tối thiểu</label>
                                    <input
                                        value={form.data.min_order_amount}
                                        onChange={(e) => form.setData('min_order_amount', e.target.value)}
                                        className="w-full rounded border px-4 py-3 text-base md:text-lg"
                                    />
                                    <label className="mt-2 inline-flex items-center text-base md:text-lg">
                                        <input
                                            type="checkbox"
                                            checked={form.data.no_min_amount}
                                            onChange={(e) => form.setData('no_min_amount', e.currentTarget.checked)}
                                        />
                                        <span className="ml-2">Không yêu cầu (0)</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="mb-1 block text-base md:text-lg font-semibold">Giới hạn lượt</label>
                                    <input
                                        value={form.data.usage_limit}
                                        onChange={(e) => form.setData('usage_limit', e.target.value)}
                                        className="w-full rounded border px-4 py-3 text-base md:text-lg"
                                    />
                                    <label className="mt-2 inline-flex items-center text-base md:text-lg">
                                        <input
                                            type="checkbox"
                                            checked={form.data.no_usage_limit}
                                            onChange={(e) => form.setData('no_usage_limit', e.currentTarget.checked)}
                                        />
                                        <span className="ml-2">Không giới hạn</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-base md:text-lg font-semibold">Thời gian áp dụng</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="datetime-local"
                                            value={form.data.starts_at?.substring(0, 16)}
                                            onChange={(e) => {
                                                form.setData('starts_at', e.target.value);
                                                validateStart(e.target.value);
                                                validateEnd(form.data.expires_at as string, e.target.value);
                                            }}
                                            onBlur={(e) => {
                                                validateStart(e.target.value);
                                                validateEnd(form.data.expires_at as string, e.target.value);
                                            }}
                                            className={`w-full rounded border px-4 py-3 text-base md:text-lg ${startError || form.errors.starts_at ? 'border-red-400' : ''}`}
                                        />
                                        {startError && <div className="mt-1 text-sm text-red-600">{startError}</div>}
                                    </div>

                                    <div>
                                        <input
                                            type="datetime-local"
                                            value={form.data.expires_at?.substring(0, 16)}
                                            onChange={(e) => {
                                                form.setData('expires_at', e.target.value);
                                                validateEnd(e.target.value, form.data.starts_at as string);
                                            }}
                                            onBlur={(e) => validateEnd(e.target.value, form.data.starts_at as string)}
                                            className={`w-full rounded border px-4 py-3 text-base md:text-lg ${endError ? 'border-red-400' : ''}`}
                                        />
                                        {endError && <div className="mt-1 text-sm text-red-600">{endError}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-[#0AC1EF] px-6 py-3 text-white shadow hover:bg-[#0894c7] text-base md:text-lg"
                                >
                                    Tạo khuyến mãi
                                </button>
                                <Link href="/admin/promotions" className="rounded-lg bg-gray-200 px-6 py-3 text-gray-800 text-base md:text-lg">
                                    Hủy
                                </Link>
                            </div>
                        </div>

                        {/* right: conditions / selection (1/3 width) */}
                        <aside className="space-y-4 text-base md:text-lg">
                            <div className="rounded border border-gray-100 bg-gray-50 p-4">
                                <h3 className="mb-2 text-base md:text-lg font-semibold">Áp dụng (chọn nhiều)</h3>

                                <div className="mb-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="text-base md:text-lg font-medium">Thương hiệu</div>
                                        <label className="flex items-center gap-2 text-base md:text-lg">
                                            <input
                                                type="checkbox"
                                                checked={selectAllBrands}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSelectAllBrands(checked);
                                                    if (checked) setAllOfType('brand', brands);
                                                    else clearAllOfType('brand');
                                                }}
                                            />
                                            <span>Chọn tất cả</span>
                                        </label>
                                    </div>
                                    <div className="max-h-40 space-y-1 overflow-auto">
                                        {brands.map((b: any) => (
                                            <label key={b.id} className="flex items-center gap-2 text-base md:text-lg">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected('brand', b.id)}
                                                    onChange={() => toggleCondition('brand', b.id)}
                                                />
                                                <span>{b.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="text-base md:text-lg font-medium">Sản phẩm</div>
                                        <label className="flex items-center gap-2 text-base md:text-lg">
                                            <input
                                                type="checkbox"
                                                checked={selectAllProducts}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSelectAllProducts(checked);
                                                    if (checked) setAllOfType('product', availableProducts);
                                                    else clearAllOfType('product');
                                                }}
                                            />
                                            <span>Chọn tất cả</span>
                                        </label>
                                    </div>
                                    <div className="max-h-40 space-y-1 overflow-auto text-base md:text-lg">
                                        {availableProducts.map((p: any) => (
                                            <label key={p.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected('product', p.id)}
                                                    onChange={() => toggleCondition('product', p.id)}
                                                />
                                                <span>{p.name}</span>
                                            </label>
                                        ))}
                                        {availableProducts.length === 0 && <div className="text-sm md:text-base text-gray-500">Không có sản phẩm phù hợp</div>}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="text-base md:text-lg font-medium">Danh mục</div>
                                        <label className="flex items-center gap-2 text-base md:text-lg">
                                            <input
                                                type="checkbox"
                                                checked={selectAllCategories}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSelectAllCategories(checked);
                                                    if (checked) setAllOfType('category', categories);
                                                    else clearAllOfType('category');
                                                }}
                                            />
                                            <span>Chọn tất cả</span>
                                        </label>
                                    </div>
                                    <div className="max-h-40 space-y-1 overflow-auto text-base md:text-lg">
                                        {categories.map((c: any) => (
                                            <label key={c.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected('category', c.id)}
                                                    onChange={() => toggleCondition('category', c.id)}
                                                />
                                                <span>{c.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded border border-gray-100 bg-white p-4 text-base md:text-lg text-gray-600">
                                <div className="mb-2">
                                    <strong className="text-gray-800">Ghi chú</strong>
                                </div>
                                <ul className="ml-5 list-disc space-y-1">
                                    <li>Chọn điều kiện sẽ giới hạn khuyến mãi chỉ áp dụng cho mục đã chọn.</li>
                                    <li>Nếu không chọn điều kiện nào, mã áp dụng cho toàn bộ sản phẩm.</li>
                                    <li>Chỉ hiển thị sản phẩm đang hoạt động và đã được duyệt.</li>
                                </ul>
                            </div>
                        </aside>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
