// @ts-nocheck
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';

export function NavMain({ items }: { items: NavItem[] }) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                asChild 
                                tooltip={item.title}
                                className="group relative overflow-hidden transition-all duration-200 hover:bg-gradient-to-r hover:from-[#0AC1EF]/10 hover:to-transparent"
                            >
                                <Link href={item.href}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#0AC1EF]/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                    <div className="relative flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-[#0AC1EF]/20 group-hover:to-[#0AC1EF]/5 flex items-center justify-center transition-all duration-200 shadow-sm">
                                            {item.icon && <item.icon className="w-4 h-4 text-gray-700 group-hover:text-[#0AC1EF] transition-colors" />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#0AC1EF] transition-colors">{item.title}</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                            {item.items?.length ? (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton 
                                                        asChild
                                                        className="group hover:bg-[#0AC1EF]/5 transition-colors"
                                                    >
                                                        <Link href={subItem.href}>
                                                            <span className="text-sm text-gray-600 group-hover:text-[#0AC1EF] transition-colors">{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            ) : null}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
