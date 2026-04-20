import * as React from "react"
import { Outlet } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"
import { Bell, Menu } from "lucide-react"

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [adminData, setAdminData] = React.useState({
    name: "Admin",
    email: "admin@heartpredict.id",
    initials: "A",
  })

  React.useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setAdminData({
          name: user.name || "Admin",
          email: user.email || "admin@heartpredict.id",
          initials: user.initial || user.name?.substring(0, 1).toUpperCase() || "A"
        })
      } catch (e) {
        console.error("Failed to parse admin data", e)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <AdminSidebar 
        user={adminData} 
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
              <h1 className="text-lg font-black text-slate-900 font-display leading-tight uppercase tracking-tight">Admin Terminal</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-100 hidden sm:flex">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">System Status</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">All Nodes Operational</span>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            
            <div className="flex items-center gap-3 pl-3">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-lg border border-slate-800">
                {adminData.initials}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-black text-slate-900 leading-none">{adminData.name}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Super Administrator</p>
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
