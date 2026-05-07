// @ts-nocheck
import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, FileText, Database, Tag, Heart, X, LogOut, User } from "lucide-react"

import { cn } from "~/lib/utils"

export interface AdminSidebarProps {
  user?: {
    name: string
    email: string
    initials: string
  }
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function AdminSidebar({ user, isMobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_set_at');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, route: "/admin/dashboard" },
    { name: "Manajemen User", icon: Users, route: "/admin/users" },
    { name: "Manajemen Artikel", icon: FileText, route: "/admin/articles" },
    { name: "Kategori Artikel", icon: Tag, route: "/admin/categories" },
    { name: "Profil Admin", icon: User, route: "/admin/profile" },
  ]

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 mb-8 flex items-center">
        <div className="w-8 h-8 rounded flex items-center justify-center text-white bg-[#238636]">
          <Heart className="w-5 h-5" />
        </div>
        <span className="text-base font-semibold text-[#c9d1d9] ml-3 tracking-tight">
          HeartCare
        </span>
      </div>

      <div className="px-2 flex-1 flex flex-col">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.route) && (item.route !== "/admin" || location.pathname === "/admin")
            return (
              <Link
                key={item.route}
                to={item.route}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-none",
                  isActive
                    ? "bg-[#161b22] text-white my-1 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#238636] before:rounded-r-md"
                    : "text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#8b949e]")} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>


    </div>
  )

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
          "fixed left-0 top-0 h-screen w-64 bg-[#0d1117] border-r border-[#30363d] py-6 z-50 lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={onMobileClose}
          className="absolute top-4 right-4 text-[#8b949e] hover:text-white lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
        {SidebarContent}
      </aside>
    </>
  )
}
