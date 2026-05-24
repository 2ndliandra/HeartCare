import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronDown, User, LogOut, HeartPulse } from "lucide-react"

import { Button } from "~/components/ui/button"
import { scrollToHash, scrollToTop } from "~/lib/gsapScroll"

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

  const scrollToSection = (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    if (window.location.pathname !== "/") {
      navigate(`/#${sectionId}`)
      return
    }

    window.history.replaceState(null, "", `/#${sectionId}`)
    scrollToHash(`#${sectionId}`)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[100] h-[72px] bg-transparent">
      <div className="grid h-full w-full grid-cols-[1fr_auto] border-b border-white/35 bg-white/55 px-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:px-0">
        <div className="flex items-center gap-2 lg:border-r lg:border-white/35 lg:px-8 xl:px-10">
          <HeartPulse className="h-5 w-5 text-emerald-700" />
          <span className="hidden text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:block">
            HeartCare
          </span>
          <span className="hidden h-2 w-2 rounded-full bg-[#10b981] sm:block" />
        </div>

        <nav className="hidden items-center justify-start gap-8 px-6 lg:flex xl:px-8">

        <Link
          to="/"
          onClick={() => {
            if (window.location.pathname === '/') {
              scrollToTop()
            }
          }}
          className="text-sm font-light tracking-[0.04em] text-[#6b7c74] transition-colors duration-150 hover:text-emerald-700"
        >
          Home
        </Link>
        <Link
          to="/#features"
          onClick={scrollToSection("features")}
          className="text-sm font-light tracking-[0.04em] text-[#6b7c74] transition-colors duration-150 hover:text-emerald-700"
        >
          Fitur
        </Link>
        <Link to="/articles" className="text-sm font-light tracking-[0.04em] text-[#6b7c74] transition-colors duration-150 hover:text-emerald-700">Artikel</Link>
        <Link
          to="/#about"
          onClick={scrollToSection("about")}
          className="text-sm font-light tracking-[0.04em] text-[#6b7c74] transition-colors duration-150 hover:text-emerald-700"
        >
          Tentang
        </Link>
      </nav>

      {!isAuthenticated ? (
        <>
          <div className="hidden items-stretch justify-end lg:flex">
            <div className="flex items-center px-6 xl:px-8">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="rounded-none text-slate-600 hover:bg-transparent hover:text-emerald-700"
              >
                <Link to="/register">Daftar</Link>
              </Button>
            </div>
            <div className="my-4 w-px bg-slate-300/80 shadow-[1px_0_0_rgba(255,255,255,0.75)]" />
            <div className="flex items-center px-6 xl:px-8">
              <Button
                variant="primary"
                size="sm"
                asChild
                className="rounded-none bg-slate-950 px-6 hover:bg-emerald-800"
              >
                <Link to="/login">Masuk</Link>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-end gap-4 lg:border-l lg:border-white/35 lg:px-8 xl:px-10">

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
                className="fixed w-56 rounded-xl border border-white/45 bg-white/75 py-2 shadow-2xl backdrop-blur-xl"
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
        </>
      )}
      </div>
    </header>
  )
}
