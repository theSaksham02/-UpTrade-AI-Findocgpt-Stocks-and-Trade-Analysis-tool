"use client"

import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-16 border-b border-purple-200/20 dark:border-purple-900/20 bg-gradient-to-r from-white/95 to-purple-50/30 dark:from-[#0F0F12]/95 dark:to-purple-950/20 backdrop-blur-sm">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-white via-purple-50/10 to-white dark:from-[#0F0F12] dark:via-purple-950/10 dark:to-[#0F0F12]">{children}</main>
      </div>
    </div>
  )
}
