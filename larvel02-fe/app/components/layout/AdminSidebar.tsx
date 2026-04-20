// @ts-nocheck
import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {LayoutDashboard, Users, FileText, Database, Tag, Heart, X, LogOut} from "lucide-react"

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
    { name: "Manajemen Dataset", icon: Database, route: "/admin/datasets" },
    { name: "Kategori Artikel", icon: Tag, route: "/admin/categories" },
  ]

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 mb-8 flex items-center">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
          <Heart className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold text-white ml-3 font-display">
          HeartPredict
        </span>
      </div>

      <div className="px-3 flex-1 flex flex-col">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.route) && (item.route !== "/admin" || location.pathname === "/admin")
            return (
              <Link
                key={item.route}
                to={item.route}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150",
                  isActive
                    ? "bg-emerald-600/10 border-l-4 border-emerald-500 -ml-3 pl-6 text-emerald-400 font-semibold"
                    : "text-slate-300 font-medium hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-slate-400")} />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="px-3 mt-auto mb-4 border-t border-slate-800 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 font-medium hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-150 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Keluar Admin</span>
        </button>
      </div>

      <div className="p-6 border-t border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-semibold flex-shrink-0">
          {user?.initials || "A"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate flex items-center gap-2">
            {user?.name || "Admin User"}
            <span className="bg-emerald-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Admin</span>
          </p>
          <p className="text-xs text-slate-400 truncate">{user?.email || "admin@example.com"}</p>
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
          "fixed left-0 top-0 h-screen w-64 bg-slate-900 py-6 z-50 lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button 
          onClick={onMobileClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
        {SidebarContent}
      </aside>
    </>
  )
}
