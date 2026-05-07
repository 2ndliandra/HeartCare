import * as React from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { UserSidebar } from "./UserSidebar"
import { Bell, Menu, User, Settings, LogOut, ChevronDown } from "lucide-react"

export function UserLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, right: 0 })
  const navigate = useNavigate()

  const [userData, setUserData] = React.useState({
    name: "User",
    email: "user@example.com",
    initials: "U",
    profile_picture: "",
  })

  React.useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setUserData({
            name: user.name || "User",
            email: user.email || "user@example.com",
            initials: user.initial || user.name?.substring(0, 1).toUpperCase() || "U",
            profile_picture: user.profile_picture || "",
          })
        } catch (e) {
          console.error("Failed to parse user data", e)
        }
      }
    }

    loadUser()
    window.addEventListener("profileUpdated", loadUser)
    return () => window.removeEventListener("profileUpdated", loadUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_set_at');
    localStorage.removeItem('user');
    setDropdownOpen(false);
    navigate('/login');
    window.location.reload();
  }

  const toggleDropdown = () => {
    if (!dropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <UserSidebar
        user={userData}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
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

            <div className="flex items-center gap-3 pl-3 border-l border-slate-100" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center gap-3 focus:outline-none">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shadow-sm border border-emerald-200/50 overflow-hidden">
                  {userData.profile_picture ? (
                    <img src={`http://localhost:8000/storage/${userData.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userData.initials
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-900 leading-none">{userData.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Patient ID: #HP-2026</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
              </button>
            </div>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0"
                  style={{ zIndex: 9998 }}
                  onClick={() => setDropdownOpen(false)}
                />
                <div
                  className="fixed w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2"
                  style={{ zIndex: 9999, top: dropdownPos.top, right: dropdownPos.right }}
                >
                  <Link
                    to="/user/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profil Saya
                  </Link>
                  <div className="border-t border-slate-200 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-slate-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
