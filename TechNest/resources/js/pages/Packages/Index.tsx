import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import PackageList from "@/components/packages/PackageList";
import PackageSubscriptionStatus from "@/components/packages/PackageSubscriptionStatus";
import { PackageItem } from "@/components/packages/PackageCard";
import { Button } from "@/components/ui/button";

interface PageProps {
  packages: PackageItem[];
  activeSubscription?: {
    id: number;
    status: string;
    package_id: number;
    auto_renew: boolean;
    expires_at: string | null;
    price: number;
  } | null;
  [key: string]: any;
}

const PackagesIndex = () => {
  const { props } = usePage<PageProps>();
  const active = props.activeSubscription;

  const handleSubscribe = (pkg: PackageItem) => {
    router.post(`/packages/${pkg.id}/subscribe`);
  };

  const toggleAutoRenew = () => {
    if (!active) return;
    router.post(`/packages/subscriptions/${active.id}/toggle-auto-renew`);
  };

  const cancel = () => {
    if (!active) return;
    router.post(`/packages/subscriptions/${active.id}/cancel`);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Gói vận chuyển", href: "/packages" }]}>
      <Head title="Gói vận chuyển" />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Gói vận chuyển tháng</h1>
          {active ? (
            <div className="space-x-2">
              <Button variant="secondary" onClick={toggleAutoRenew}>
                {active.auto_renew ? "Tắt tự gia hạn" : "Bật tự gia hạn"}
              </Button>
              <Button variant="destructive" onClick={cancel}>
                Huỷ gói
              </Button>
            </div>
          ) : null}
        </div>

        <PackageSubscriptionStatus status={active ?? null} />

        <PackageList
          packages={props.packages}
          onSubscribe={handleSubscribe}
          activePackageId={active?.package_id}
        />
      </div>
    </AppLayout>
  );
};

export default PackagesIndex;