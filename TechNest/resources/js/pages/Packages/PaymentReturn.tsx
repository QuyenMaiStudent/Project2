import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, PauseCircle } from 'lucide-react';

type Props = {
    status: 'success' | 'failed' | 'canceled';
    heading: string;
    message?: string;
    redirectUrl: string;
};

export default function PaymentReturn({ status, heading, message, redirectUrl }: Props) {
    const [seconds, setSeconds] = useState(4);

    useEffect(() => {
        if (status === 'success') {
            const t = setInterval(() => setSeconds((s) => s - 1), 1000);
            return () => clearInterval(t);
        }
    }, [status]);

    useEffect(() => {
        if (status === 'success' && seconds <= 0) {
            window.location.href = redirectUrl;
        }
    }, [seconds, status, redirectUrl]);

    const getColors = () => {
        if (status === 'success') return { text: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100' , iconColor: 'text-emerald-600'};
        if (status === 'canceled') return { text: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-100', iconColor: 'text-amber-600' };
        return { text: 'text-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-100', iconColor: 'text-rose-600' };
    };

    const colors = getColors();

    const Icon = status === 'success' ? CheckCircle : status === 'canceled' ? PauseCircle : XCircle;

    return (
        <>
            <Head title="Package payment" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-[65vh]">
                <div className="max-w-xl mx-auto">
                    <div className={`rounded-xl ${colors.bg} border ${colors.ring} p-6 shadow-sm flex gap-4 items-start`}>
                        <div className={`p-3 rounded-lg bg-white/60 flex items-center justify-center`}>
                            <Icon className={`h-10 w-10 ${colors.iconColor}`} />
                        </div>

                        <div className="flex-1">
                            <h1 className={`text-2xl font-semibold ${colors.text}`}>{heading}</h1>
                            {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}

                            <div className="mt-4 flex items-center gap-3">
                                <Link
                                    href={redirectUrl}
                                    className="inline-flex items-center rounded bg-[#0AC1EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#09b3db]"
                                >
                                    {status === 'success' ? 'Quay về gói' : 'Thử lại'}
                                </Link>

                                {status === 'success' && (
                                    <div className="text-sm text-slate-600">
                                        Chuyển trang tự động sau <span className="font-semibold text-slate-900">{seconds}</span> giây
                                    </div>
                                )}
                            </div>

                            {/* progress bar */}
                            {status === 'success' && (
                                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-400 transition-all"
                                        style={{ width: `${(seconds / 4) * 100}%` }}
                                    />
                                </div>
                            )}

                            <div className="mt-4 text-xs text-slate-500">
                                Nếu không tự chuyển, nhấn nút để tiếp tục. Mọi thắc mắc vui lòng liên hệ CSKH.
                            </div>
                        </div>
                    </div>

                    {/* extra fallback actions */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Link
                            href="/packages"
                            className="text-sm px-4 py-2 rounded border bg-white hover:bg-slate-50"
                        >
                            Về trang gói
                        </Link>
                        <a
                            href={redirectUrl}
                            className="text-sm px-4 py-2 rounded border bg-white hover:bg-slate-50"
                        >
                            Mở trang đích
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}