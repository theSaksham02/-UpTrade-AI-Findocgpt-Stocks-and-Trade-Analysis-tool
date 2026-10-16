// The terminal renders full-screen; no extra chrome or auth gate here.
// (Real authentication is not implemented yet — see LAUNCH.md.)
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
