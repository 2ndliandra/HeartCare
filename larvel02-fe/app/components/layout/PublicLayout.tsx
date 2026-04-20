import * as React from "react"
import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export function PublicLayout() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem("auth_token"))
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token")
      setIsAuthenticated(!!token)
      if (token) {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          try {
            const userData = JSON.parse(userStr)
            setUser({
              name: userData.name,
              initials: userData.initial || userData.name?.substring(0, 1).toUpperCase() || "U"
            })
          } catch (e) {
            setUser(null)
          }
        }
      } else {
        setUser(null)
      }
    }
    checkAuth()
    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
