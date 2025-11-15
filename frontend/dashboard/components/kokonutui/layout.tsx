"use client"

import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import UptradeCopilot from "@/components/uptrade-copilot"
import Aurora from "@/components/Aurora"
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
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""} relative overflow-hidden`}>
      {/* Aurora Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ opacity: theme === "dark" ? 0.3 : 0.2 }}>
        <Aurora colorStops={["#6b21a8", "#8b5cf6", "#7c3aed"]} amplitude={1.2} blend={0.6} speed={0.5} />
      </div>
      
      <Sidebar />
      <div className="w-full flex flex-1 flex-col relative z-10">
        <header className="h-16 border-b border-purple-200/20 dark:border-purple-900/20 bg-gradient-to-r from-white/95 to-purple-50/30 dark:from-[#0F0F12]/95 dark:to-purple-950/20 backdrop-blur-sm">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-white/80 via-purple-50/10 to-white/80 dark:from-[#0F0F12]/80 dark:via-purple-950/10 dark:to-[#0F0F12]/80 backdrop-blur-sm">
          {children}
        </main>
      </div>
      <UptradeCopilot />
    </div>
  )
}
