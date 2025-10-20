import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';

interface NavMainProps {
  className?: string;
  items?: NavItem[];
}

export function NavMain({ className, items = [] }: NavMainProps) {
  // Thêm debug log
  console.log('NavMain items received:', items);
  
  return (
    <nav className={cn('grid items-start gap-2 px-2 text-sm font-medium', className)}>
      {/* Map qua từng item và render chúng */}
      {items.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            prefetch
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
