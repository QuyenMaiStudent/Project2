import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CheckCircle, LayoutGrid, Package, Users, 
         Plus, Eye, Tag, ShoppingCart, MapPin, 
         CreditCard, MessageCircle, Video, Settings, LogOut, Truck, 
         BarChart3} from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const PRIMARY = '#0AC1EF';

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
                title: 'Quản lý khuyến mãi',
                href: '/admin/promotions',
                icon: Tag,
            },
            {
                title: 'Quản lý thương hiệu',
                href: '/admin/brands',
                icon: Tag,
            },
            {
                title: 'Quản lý shipper',
                href: '/admin/shippers',
                icon: Truck,
            },
            {
                title: "Quản lý gói dịch vụ",
                href: '/admin/packages',
                icon: CheckCircle,
            },
            {
                title: 'Thống kê',
                href: '/admin/statistics',
                icon: BarChart3,
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
                title: 'Thống kê',
                href: '/seller/statistics',
                icon: BarChart3,
            },
            {
                title: 'Live Stream',
                href: '/seller/live',
                icon: Video,
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
                title: 'Đơn hàng',
                href: '/seller/orders',
                icon: BookOpen,
            },
            {
                title: 'Tin nhắn',
                href: '/chat',
                icon: MessageCircle,
            },
            {
                title: 'Vị trí cửa hàng',
                href: '/seller/store',
                icon: MapPin,
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
                title: 'Theo dõi vận chuyển',
                href: '/tracking',
                icon: Truck,
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

    // Helper: user initials
    const initials = (name?: string) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
    };

    // Friendly role label
    const roleLabel = () => {
        if (!user) return 'Guest';
        if (user.isSuperAdmin) return 'Super Admin';
        if (user.isAdmin) return 'Admin';
        if (user.isSeller) return 'Seller';
        return 'Customer';
    };

    return (
        <Sidebar collapsible={false} variant='inset' className='w-64'>
            {/* Header với gradient đẹp hơn */}
            <SidebarHeader>
                <div
                    className="relative overflow-hidden rounded-lg mx-2 mt-2"
                    style={{ 
                        background: `linear-gradient(135deg, ${PRIMARY} 0%, #0891B2 100%)`,
                        boxShadow: '0 4px 12px rgba(10, 193, 239, 0.2)'
                    }}
                >
                    <div className="absolute inset-0 bg-white/5"></div>
                    <Link href={"/"} className="relative flex items-center gap-3 p-5">
                        <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <AppLogoIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-white font-bold text-base tracking-wide">TechNest</div>
                            <div className="text-white/90 text-xs font-medium">Marketplace Platform</div>
                        </div>
                    </Link>
                </div>

                {/* User info card - compact và đẹp hơn */}
                <div className="mx-2 mt-3 mb-2">
                    <div 
                        className="relative overflow-hidden rounded-lg border"
                        style={{ 
                            borderColor: 'rgba(10, 193, 239, 0.2)',
                            background: 'linear-gradient(135deg, rgba(10, 193, 239, 0.05) 0%, rgba(10, 193, 239, 0.02) 100%)'
                        }}
                    >
                        <div className="flex items-center gap-3 p-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-md"
                                style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)' }}
                            >
                                {initials(user?.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? 'Người dùng'}</div>
                                <div className="text-xs text-gray-600 truncate">{user?.email ?? ''}</div>
                            </div>
                            <span
                                className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm"
                                style={{ 
                                    background: `linear-gradient(135deg, ${PRIMARY} 0%, #0891B2 100%)`,
                                    color: 'white'
                                }}
                            >
                                {roleLabel()}
                            </span>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-2 border-t border-gray-200/50">
                {/* Quick actions - nhỏ gọn hơn */}
                <div className="flex items-center gap-1.5 mb-2">
                    <Link 
                        href="/settings" 
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-sm group"
                    >
                        <Settings size={16} className="text-gray-700 group-hover:text-[#0AC1EF] transition-colors" />
                        <span className="text-xs font-medium text-gray-700">Cài đặt</span>
                    </Link>

                    <Link 
                        href="/logout" 
                        method="post"
                        as="button"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-sm group"
                    >
                        <LogOut size={16} className="text-red-600 group-hover:text-red-700 transition-colors" />
                        <span className="text-xs font-medium text-red-600">Đăng xuất</span>
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
