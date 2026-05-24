import type { LucideIcon } from "lucide-react"
import { Heart } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { cn } from "~/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "~/components/ui/sidebar"

export type AppSidebarItem = {
  name: string
  icon: LucideIcon
  route: string
}

type AppSidebarProps = {
  items: AppSidebarItem[]
  groupLabel: string
  brandLabel?: string
  dashboardRoute: string
}

function isItemActive(pathname: string, route: string) {
  if (route === "/admin/dashboard") {
    return pathname === "/admin" || pathname === "/admin/dashboard"
  }

  if (route === "/user") {
    return pathname === "/user" || pathname === "/user/dashboard"
  }

  return pathname === route || pathname.startsWith(`${route}/`)
}

export function AppSidebar({
  items,
  groupLabel,
  brandLabel = "HeartCare",
  dashboardRoute,
}: AppSidebarProps) {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="bg-transparent"
    >
      <SidebarHeader className="gap-3 p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={brandLabel}
              className="h-auto min-h-12 rounded-2xl border border-emerald-100/80 bg-white px-3 py-3 shadow-sm hover:bg-emerald-50/60 hover:text-slate-950 data-[active=true]:bg-white group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:min-h-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:p-0"
            >
              <Link to={dashboardRoute}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:rounded-md">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-slate-900">
                    {brandLabel}
                  </span>
                  <span className="truncate text-xs text-slate-500">
                    Smart heart monitoring
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-3 bg-slate-200/80 group-data-[collapsible=icon]:mx-1.5" />

      <SidebarContent className="px-2 pb-3 group-data-[collapsible=icon]:px-1.5">
        <SidebarGroup className="px-1 group-data-[collapsible=icon]:px-0">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {groupLabel}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = isItemActive(pathname, item.route)

                return (
                  <SidebarMenuItem key={item.route}>
                  <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.name}
                      className={cn(
                        "h-10 rounded-xl px-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950",
                        "data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:shadow-[inset_0_0_0_1px_rgba(16,185,129,0.14)]",
                        "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:px-0"
                      )}
                    >
                      <Link
                        to={item.route}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false)
                          }
                        }}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
