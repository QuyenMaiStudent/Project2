// @ts-nocheck
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

export function NavMain({ items }: { items: NavItem[] }) {
  const PRIMARY = '#0AC1EF';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const isMatch = (href?: string) => {
    if (!href) return false;
    if (href === '/') return currentPath === '/';
    return currentPath === href || currentPath.startsWith(href + '/');
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="pt-1"> {/* thêm padding top nhẹ */}
        {items.map((item) => {
          const active = !!item.isActive || isMatch(item.href);
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              {/* tăng khoảng cách giữa các item bằng mb-1 */}
              <SidebarMenuItem className="mb-1">
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`group relative transition-all duration-150 w-full rounded-md ${active ? 'bg-[#E8FBFF] border-l-4 border-[#0AC1EF]' : 'hover:bg-[#F5FDFF]'}`}
                >
                  {/* ICON + TEXT: tăng chiều cao item, icon lớn hơn, text vẫn wrap */}
                  <Link href={item.href} className="flex items-center w-full pl-1 py-5 min-h-[56px]" aria-current={active ? 'page' : undefined}>
                    {/* Icon column - nhỏ và sát trái; tăng kích thước icon */}
                    <div className="flex-shrink-0 flex items-center justify-center pl-2" style={{ width: 44 }}>
                      {item.icon && (
                        <item.icon
                          className={`${active ? 'text-[#0891B2]' : 'text-[#29656a]'} w-8 h-8`} /* tăng icon lên 32px */
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {/* Text column - căn trái, allow wrap, tăng line-height */}
                    <div className="flex-1 min-w-0 pl-3 pr-3">
                      <div className={`${active ? 'text-[#0891B2] font-semibold' : 'text-gray-700 font-medium'} text-lg leading-8 whitespace-normal break-words text-left`}>
                        {item.title}
                      </div>
                    </div>

                    {/* Chevron */}
                    {item.items?.length ? (
                      <div className="flex-shrink-0 pr-3 pt-1">
                        <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'text-[#0891B2]' : 'text-gray-400'}`} />
                      </div>
                    ) : null}
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((sub) => {
                        const subActive = !!sub.isActive || isMatch(sub.href);
                        return (
                          <SidebarMenuSubItem key={sub.title} className="mb-1">
                            <SidebarMenuSubButton
                              asChild
                              className={`w-full rounded-md ${subActive ? 'bg-[#E8FBFF] border-l-4 border-[#0AC1EF]' : 'hover:bg-[#F5FDFF]'}`}
                            >
                              <Link href={sub.href} className="flex items-center w-full pl-12 pr-3 py-4 min-h-[52px]" aria-current={subActive ? 'page' : undefined}>
                                <span className={`${subActive ? 'text-[#0891B2] font-semibold' : 'text-gray-600'} text-lg leading-7 whitespace-normal break-words text-left`}>
                                  {sub.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
