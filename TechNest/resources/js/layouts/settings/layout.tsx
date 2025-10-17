import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home, MapPin, ShoppingCart } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    //Lấy cartCount từ Inertia shared props
    const { props } = usePage<SharedData>();
    const cartCount = (props.cartCount ?? 0) as number;

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === (typeof item.href === 'string' ? item.href : item.href.url),
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}

                        {/* Quick links in sidebar (same style as other nav items) */}
                        <div className="mt-4 border-t pt-3">
                            <Button size="sm" variant="ghost" asChild className="w-full justify-start">
                                <Link href="/products" prefetch>
                                    <Home className="mr-2 h-4 w-4 text-blue-600" />
                                    Sản phẩm
                                </Link>
                            </Button>

                            <Button size="sm" variant="ghost" asChild className="w-full justify-start">
                                <Link href="/cart" prefetch>
                                    <ShoppingCart className="mr-2 h-4 w-4 text-green-600" />
                                    Giỏ hàng
                                    {cartCount > 0 && (
                                        <span className='ml-2 inline-flex items-center justify-center px-2 py-0.5 font-medium leading-none text-white bg-red-600 rounded-full'>
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </Button>

                            <Button size="sm" variant="ghost" asChild className="w-full justify-start">
                                <Link href="/shipping-addresses" prefetch>
                                    <MapPin className="mr-2 h-4 w-4 text-orange-600" />
                                    Địa chỉ giao hàng
                                </Link>
                            </Button>
                        </div>
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>

            {/* quick links moved into sidebar for consistent formatting */}
        </div>
    );
}
