import { FileText, LayoutDashboard, Tag, User, Users } from "lucide-react"

import { AppSidebar, type AppSidebarItem } from "./AppSidebar"

export interface AdminSidebarProps {
  user?: {
    name: string
    email: string
    initials: string
  }
}

const menuItems: AppSidebarItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, route: "/admin/dashboard" },
  { name: "Manajemen User", icon: Users, route: "/admin/users" },
  { name: "Manajemen Artikel", icon: FileText, route: "/admin/articles" },
  { name: "Kategori Artikel", icon: Tag, route: "/admin/categories" },
  { name: "Profil Admin", icon: User, route: "/admin/profile" },
]

export function AdminSidebar() {
  return (
    <AppSidebar
      items={menuItems}
      groupLabel="Administrator"
      dashboardRoute="/admin/dashboard"
    />
  )
}
