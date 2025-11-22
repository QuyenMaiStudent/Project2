import { PropsWithChildren } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

interface ShipperAuthProps {
    auth: {
        shipper?: {
            name: string;
            email: string;
        };
    };
}

export default function ShipperLayout({ children }: PropsWithChildren) {
    const page = usePage<ShipperAuthProps>();
    const auth = (page.props as any)?.auth ?? { shipper: null };

    const shipper = auth.shipper;

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <Link href="/shipper/dashboard" className="text-lg font-semibold text-indigo-600">
                        TechNest Shipper
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                        {shipper ? (
                            <>
                                <span>
                                    {shipper.name}
                                    {shipper.phone && ` • ${shipper.phone}`}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => router.post('/shipper/logout')}
                                    className="rounded border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/shipper/login"
                                className="rounded border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900"
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
    );
}