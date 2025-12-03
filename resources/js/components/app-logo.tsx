import { Link } from '@inertiajs/react';

export default function AppLogo({
  asLink = true,
  variant = 'full' as 'full' | 'icon',
}: {
  asLink?: boolean;
  variant?: 'full' | 'icon';
}) {
  // compact icon (for sidebar small avatar)
  const icon = (
    <div className="flex items-center justify-center">
      <img
        src="/images/logo.png"
        alt="TechNest"
        className="h-6 w-6 object-contain"
      />
    </div>
  );

  const full = (
    <div className="flex items-center gap-3 w-full py-2">
      <img
        src="/images/logo.png"
        alt="TechNest Logo"
        className="h-14 w-auto"
      />
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-[#0AC1EF]">Tech Nest</span>
        <span className="text-xs text-gray-500">Platform</span>
      </div>
    </div>
  );

  const content = variant === 'icon' ? icon : full;

  if (asLink) {
    return <Link href="/" className="block w-full">{content}</Link>;
  }

  return <div className="block w-full">{content}</div>;
}
