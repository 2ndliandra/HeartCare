import * as React from "react"
import { Outlet } from "react-router-dom"
import { UserSidebar } from "./UserSidebar"
import { Bell, Menu } from "lucide-react"

export function UserLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userData, setUserData] = React.useState({
    name: "User",
    email: "user@example.com",
    initials: "U",
  })

  React.useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserData({
          name: user.name || "User",
          email: user.email || "user@example.com",
          initials: user.initial || user.name?.substring(0, 1).toUpperCase() || "U"
        })
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <UserSidebar 
        user={userData} 
        isMobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-slate-900 font-display leading-tight">Halo, {userData.name} 👋</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shadow-sm border border-emerald-200/50">
                {userData.initials}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-black text-slate-900 leading-none">{userData.name}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Patient ID: #HP-2026</p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
