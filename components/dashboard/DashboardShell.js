"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PUBLIC_BOOK_PATH = "/book/30min";

function NavItem({ href, icon, children, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
        active ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function IconEventTypes() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function IconBookings() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function IconChevron({ open }) {
  return (
    <svg
      className={`ml-auto h-4 w-4 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg className="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconRouting() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const [appsOpen, setAppsOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`);
  const appsActive = pathname?.startsWith("/dashboard/apps");

  const copyPublicLink = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}${PUBLIC_BOOK_PATH}` : "";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      <aside
        className={`fixed z-50 h-full w-[240px] flex-col border-r border-white/[0.06] bg-[#0c0c0c] transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-3">
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium text-white hover:bg-white/5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
              MA
            </span>
            <span className="truncate">Manav Agarwal</span>
            <svg className="ml-auto h-4 w-4 shrink-0 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button type="button" className="rounded-md p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300" aria-label="Search">
            <IconSearch />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
          <NavItem href="/dashboard/event-types" icon={<IconEventTypes />} active={isActive("/dashboard/event-types")}>
            Event types
          </NavItem>
          <NavItem href="/dashboard/bookings" icon={<IconBookings />} active={isActive("/dashboard/bookings")}>
            Bookings
          </NavItem>
          <NavItem href="/dashboard/availability" icon={<IconClock />} active={isActive("/dashboard/availability")}>
            Availability
          </NavItem>
          <NavItem href="/dashboard/teams" icon={<IconUsers />} active={isActive("/dashboard/teams")}>
            Teams
          </NavItem>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setAppsOpen((o) => !o)}
              className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-medium hover:bg-white/5 ${
                appsActive ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <IconGrid />
              <span>Apps</span>
              <IconChevron open={appsOpen} />
            </button>
            {appsOpen && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-2">
                <Link
                  href="/dashboard/apps"
                  className={`block rounded-md px-2 py-1.5 text-sm ${pathname === "/dashboard/apps" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  App store
                </Link>
                <Link
                  href="/dashboard/apps/installed"
                  className={`block rounded-md px-2 py-1.5 text-sm ${pathname === "/dashboard/apps/installed" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  Installed apps
                </Link>
              </div>
            )}
          </div>

          <NavItem href="/dashboard/routing" icon={<IconRouting />} active={pathname === "/dashboard/routing"}>
            Routing
          </NavItem>
          <NavItem href="/dashboard/workflows" icon={<IconBolt />} active={pathname === "/dashboard/workflows"}>
            Workflows
          </NavItem>
          <NavItem href="/dashboard/insights" icon={<IconChart />} active={pathname === "/dashboard/insights"}>
            Insights
          </NavItem>
        </nav>

        <div className="space-y-0.5 border-t border-white/[0.06] p-2">
          <Link
            href={PUBLIC_BOOK_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md px-2.5 py-2 text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
          >
            View public page
          </Link>
          <button
            type="button"
            onClick={copyPublicLink}
            className="w-full rounded-md px-2.5 py-2 text-left text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
          >
            Copy public page link
          </button>
          <button type="button" className="w-full rounded-md px-2.5 py-2 text-left text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300">
            Refer and earn
          </button>
          <button type="button" className="w-full rounded-md px-2.5 py-2 text-left text-sm text-zinc-500 hover:bg-white/5 hover:text-zinc-300">
            Settings
          </button>
          <p className="px-2.5 pt-2 text-[10px] leading-relaxed text-zinc-600">© Cal.com clone</p>
        </div>
      </aside>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:ml-[240px]">
        <div className="md:hidden p-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-lg"
          >
            ☰
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
