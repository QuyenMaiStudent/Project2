import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

type Props = {
    status: 'success' | 'failed' | 'canceled';
    heading: string;
    message?: string;
    redirectUrl: string;
};

export default function PaymentReturn({ status, heading, message, redirectUrl }: Props) {
    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                window.location.href = redirectUrl;
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [status, redirectUrl]);

    const statusColor =
        status === 'success' ? 'text-green-600' : status === 'canceled' ? 'text-yellow-600' : 'text-red-600';

    return (
        <>
            <Head title="Package payment" />
            <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center space-y-4 px-6 text-center">
                <h1 className={`text-2xl font-semibold ${statusColor}`}>{heading}</h1>
                {message && <p className="text-slate-600">{message}</p>}
                <Link
                    href={redirectUrl}
                    className="rounded bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    {status === 'success' ? 'Back to packages' : 'Try again'}
                </Link>
            </div>
        </>
    );
}