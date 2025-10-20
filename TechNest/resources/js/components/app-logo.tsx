import { Link } from '@inertiajs/react';

export default function AppLogo({ asLink = true }: { asLink?: boolean }) {
  const content = (
    <div className="flex items-center gap-3 w-full py-2">
      <img
        src="/images/logo.png"
        alt="TechNest Logo"
        className="h-14 w-auto" // Kích thước logo hợp lý
      />
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-[#0AC1EF]">Tech Nest</span>
        <span className="text-xs text-gray-500">Platform</span>
      </div>
    </div>
  );

  if (asLink) {
    return <Link href="/" className="block w-full">{content}</Link>;
  }

  return <div className="block w-full">{content}</div>;
}
