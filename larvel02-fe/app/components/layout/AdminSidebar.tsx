import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, FileText, Tag, Heart, X, User, ChevronsLeft } from "lucide-react"
import { cn } from "~/lib/utils"

export interface AdminSidebarProps {
  user?: {
    name: string
    email: string
    initials: string
  }
  isMobileOpen: boolean
  onMobileClose: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function AdminSidebar({ isMobileOpen, onMobileClose, isCollapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const location = useLocation()
  const { pathname } = location

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: "/admin/dashboard" },
    { name: "Manajemen User", icon: Users, route: "/admin/users" },
    { name: "Manajemen Artikel", icon: FileText, route: "/admin/articles" },
    { name: "Kategori Artikel", icon: Tag, route: "/admin/categories" },
    { name: "Profil Admin", icon: User, route: "/admin/profile" },
  ]

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onMobileClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white py-6 z-50 transition-transform duration-300 ease-in-out flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"
        )}
        style={{ borderRight: "0.5px solid rgb(226 232 240)" }}
      >
        <button
          onClick={onMobileClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col h-full bg-white">
          <div className="px-6 mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded flex items-center justify-center text-white bg-emerald-600">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-base font-semibold text-slate-900 ml-3 tracking-tight">HeartCare</span>
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Tutup sidebar"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="px-2 flex-1 flex flex-col">
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const isDashboardRoute = item.route === "/admin/dashboard"
                const isActive = isDashboardRoute
                  ? pathname === "/admin" || pathname === "/admin/dashboard"
                  : pathname === item.route || pathname.startsWith(`${item.route}/`)

                return (
                  <Link
                    key={item.route}
                    to={item.route}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 my-1 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-emerald-600 before:rounded-r-md"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-emerald-600" : "text-slate-400")} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
