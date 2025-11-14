import { Head, router, useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { PackageItem } from "@/components/packages/PackageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Textarea } from "@headlessui/react";

interface AdminPackage extends PackageItem {
  is_active: boolean;
}

interface Props {
  packages: AdminPackage[];
}

const ManagePackages = ({ packages }: Props) => {
  const { data, setData, post, processing, reset } = useForm({
    name: "",
    description: "",
    price: 99000,
    duration_days: 30,
    is_active: true,
    features: [] as string[],
  });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post("/admin/packages", {
      onSuccess: () => reset(),
    });
  };

  return (
    <>
      <Head title="Quản lý gói vận chuyển" />

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tạo gói mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name">Tên gói</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(event) => setData("name", event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="price">Giá (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  value={data.price}
                  onChange={(event) => setData("price", Number(event.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="duration_days">Số ngày hiệu lực</Label>
                <Input
                  id="duration_days"
                  type="number"
                  value={data.duration_days}
                  onChange={(event) => setData("duration_days", Number(event.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={data.description ?? ""}
                  onChange={(event) => setData("description", event.target.value)}
                />
              </div>
              <div className="flex items-center justify-between rounded border px-3 py-2">
                <Label htmlFor="is_active">Kích hoạt</Label>
                <Switch
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) => setData("is_active", checked)}
                />
              </div>
              <Button type="submit" disabled={processing} className="w-full">
                Lưu
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách gói</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{pkg.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(pkg.price / 1000).toLocaleString("vi-VN")}₫ • {pkg.duration_days} ngày
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.post(`/admin/packages/${pkg.id}/toggle`)}
                  >
                    {pkg.is_active ? "Vô hiệu hoá" : "Kích hoạt"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ManagePackages;