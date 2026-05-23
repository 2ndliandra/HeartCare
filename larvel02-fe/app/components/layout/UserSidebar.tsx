import {
  Heart,
  HeartPulse,
  History,
  LayoutDashboard,
  MessageSquare,
  User,
} from "lucide-react"

import { AppSidebar, type AppSidebarItem } from "./AppSidebar"

export interface UserSidebarProps {
  user?: {
    name: string
    email: string
    initials: string
  }
}

const menuItems: AppSidebarItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, route: "/user" },
  { name: "Cek Kesehatan", icon: HeartPulse, route: "/user/cek-kesehatan" },
  { name: "Hasil Terakhir", icon: Heart, route: "/user/hasil-prediksi" },
  { name: "Riwayat Prediksi", icon: History, route: "/user/riwayat" },
  { name: "Konsultasi AI", icon: MessageSquare, route: "/user/konsultasi" },
  { name: "Profil", icon: User, route: "/user/profile" },
]

export function UserSidebar() {
  return (
    <AppSidebar
      items={menuItems}
      groupLabel="Patient workspace"
      dashboardRoute="/user"
    />
  )
}
