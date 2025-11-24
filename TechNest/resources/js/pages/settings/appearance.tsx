import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cài đặt giao diện',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    const primaryColor = '#0AC1EF';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cài đặt giao diện" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div style={{ width: 6, height: 40, borderRadius: 6, background: primaryColor }} />
                        <HeadingSmall title="Cài đặt giao diện" description="Cập nhật cài đặt giao diện của bạn" />
                    </div>

                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
