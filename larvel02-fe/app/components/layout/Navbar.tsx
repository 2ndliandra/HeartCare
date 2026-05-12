import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronDown, User, LogOut, HeartPulse } from "lucide-react"

import { Button } from "~/components/ui/button"

export interface NavbarProps {
  isAuthenticated?: boolean
  user?: {
    name: string
    initials: string
    profile_picture?: string
  }
}

export function Navbar({ isAuthenticated = false, user }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const navigate = useNavigate()
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [dropdownPos, setDropdownPos] = React.useState({ top: 0, right: 0 })

  const getDashboardRoute = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return '/user';
    }

    try {
      const userData = JSON.parse(userStr);
      return userData.roles?.includes('admin') ? '/admin/dashboard' : '/user';
    } catch {
      return '/user';
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setDropdownOpen(false);
    navigate('/');
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
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
          <HeartPulse className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-slate-900 font-display hidden sm:block">
          HeartCare
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        <Link
          to="/"
          onClick={() => {
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-150"
        >
          Home
        </Link>
        <a href="/#fitur" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-150">Feature</a>
        <Link to="/articles" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-150">Artikel</Link>
        <a href="/#articles" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-150">About</a>
      </nav>

      {!isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Masuk</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link to="/register">Daftar</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold overflow-hidden">
                {user?.profile_picture ? (
                  <img src={`http://localhost:8000/storage/${user.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.initials || "U"
                )}
              </div>
              <span className="text-sm font-medium text-slate-700 ml-3 hidden md:block">
                {user?.name || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-1 hidden md:block" />
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
                  to={getDashboardRoute()}
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
      )}
    </header>
  )
}
