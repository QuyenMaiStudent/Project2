import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CheckCircle, Clock, DollarSign, Folder, LayoutGrid, Package, Users, 
         XCircle, Plus, Eye, Tag, ShoppingCart, MapPin, Home, 
         CreditCard, MessageCircle, Video} from 'lucide-react'; // Thêm Video icon
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    
    // Xác định href cho Dashboard dựa vào role
    const dashboardHref = () => {
        if (user?.isAdmin || user?.isSuperAdmin) return '/admin/dashboard';
        if (user?.isSeller) return '/seller/dashboard';
        return '/customer/dashboard';
    };

    // Menu cơ bản
    let mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardHref(),
            icon: LayoutGrid,
        },
    ];

    // Thêm menu admin nếu có quyền admin
    if (user?.isAdmin || user?.isSuperAdmin) {
        mainNavItems = [
            ...mainNavItems,
            {
                title: 'Quản lý sản phẩm',
                href: '/admin/products',
                icon: Package,
            },
            {
                title: 'Quản lý danh mục',
                href: '/admin/categories',
                icon: Package,
            },
            {
                title: 'Quản lý địa điểm',
                href: '/admin/locations',
                icon: MapPin,
            },
            {
                title: 'Quản lý khuyến mãi',
                href: '/admin/promotions',
                icon: DollarSign,
            },
            {
                title: 'Quản lý thương hiệu',
                href: '/admin/brands',
                icon: Tag,
            },
            {
                title: "Quản lý gói dịch vụ",
                href: '/admin/packages',
                icon: CheckCircle,
            }
        ];

        if (user?.isSuperAdmin) {
            mainNavItems.push({
                title: "Quản lý người dùng",
                href: '/admin/users',
                icon: Users,
            });
        }
    }
    
    // Thêm menu seller nếu là seller
    if (user?.isSeller) {
        mainNavItems = [
            ...mainNavItems,
            {
                title: 'Live Stream',
                href: '/seller/live',
                icon: Video,
            },
            {
                title: 'Thêm sản phẩm',
                href: '/seller/products/create',
                icon: Plus,
            },
            {
                title: 'Xem sản phẩm',
                href: '/seller/products',
                icon: Eye,
            },
            {
                title: 'Khuyến mãi của tôi',
                href: '/seller/promotions',
                icon: Tag,
            },
            {
                title: 'Tin nhắn',
                href: '/chat',
                icon: MessageCircle,
            },
        ];
    }
    
    // Thêm menu customer nếu không phải admin hoặc seller (customer thông thường)
    if (user && !user.isAdmin && !user.isSuperAdmin && !user.isSeller) {
        mainNavItems = [
            ...mainNavItems,
            {
                title: 'Live Streams',
                href: '/live',
                icon: Video,
            },
            {
                title: 'Đơn hàng',
                href: '/orders',
                icon: BookOpen,
            },
            {
                title: 'Giỏ hàng',
                href: '/cart',
                icon: ShoppingCart,
            },
            {
                title: 'Địa chỉ giao hàng',
                href: '/shipping-addresses',
                icon: MapPin,
            },
            {
                title: 'Lịch sử giao dịch',
                href: '/transactions',
                icon: CreditCard,
            },
            {
                title: 'Tin nhắn',
                href: '/chat',
                icon: MessageCircle,
            },
            {
                title: 'Gói vận chuyển',
                href: '/packages',
                icon: Package,
            }
        ];
    }

    return (
        <Sidebar collapsible='icon' variant='inset'>
            {/* Header đơn giản */}
            <div className="pt-4 pb-2 px-4 border-b border-sidebar-border/50">
                <Link href={dashboardHref()} className="block w-full">
                    <AppLogo asLink={false} />
                </Link>
            </div>

            <SidebarContent className="overflow-auto">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
