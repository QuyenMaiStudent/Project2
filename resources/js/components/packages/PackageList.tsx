import PackageCard, { PackageItem } from "./PackageCard";

interface Props {
    packages: PackageItem[];
    onSubscribe?: (pkg: PackageItem) => void;
    activePackageId?: number;
}

const PackageList = ({ packages, onSubscribe, activePackageId }: Props) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch text-lg">
        {packages.map((pkg) => (
            <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSubscribe={onSubscribe}
                isActive={pkg.id === activePackageId}
            />
        ))}
    </div>
);

export default PackageList;