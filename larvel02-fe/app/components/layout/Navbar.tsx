import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Bell, ChevronDown, User, Settings, LogOut, HeartPulse } from "lucide-react"

import { Button } from "~/components/ui/button"

export interface NavbarProps {
  isAuthenticated?: boolean
  user?: {
    name: string
    initials: string
  }
}

export function Navbar({ isAuthenticated = false, user }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setDropdownOpen(false);
    navigate('/');
    window.location.reload();
  }
  
  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
          <HeartPulse className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-slate-900 font-display hidden sm:block">
          HeartPredict
        </span>
      </div>

      {!isAuthenticated ? (
        <>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-150">Beranda</Link>
            <a href="/#fitur" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-150">Fitur</a>
            <Link to="/articles" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-150">Artikel</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Masuk</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link to="/register">Daftar</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">
                {user?.initials || "U"}
              </div>
              <span className="text-sm font-medium text-slate-700 ml-3 hidden md:block">
                {user?.name || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-1 hidden md:block" />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-md border border-slate-200 py-2 z-20">
                  <Link
                    to="/user/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profil Saya
                  </Link>
                  <Link
                    to="/user/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Pengaturan
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
        </div>
      )}
    </header>
  )
}
