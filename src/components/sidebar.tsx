"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  DollarSign,
  Phone,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Shield,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const ADMIN_EMAILS = ["bruno.f.scotton@gmail.com"];

const navItems = [
  { href: "/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/technicians", label: "Technicians", icon: Users },
  { href: "/pricebook", label: "Pricebook", icon: BookOpen },
  { href: "/customers", label: "Customers", icon: UserCircle },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/calls", label: "Call History", icon: Phone },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { company, logout } = useAuth();

  return (
    <>
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-5">
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
          <rect x="12" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
          <rect x="18" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
          <rect x="24" y="3" width="3.5" height="42" rx="1.75" fill="#3B6FFF" />
          <rect x="30" y="6" width="3.5" height="36" rx="1.75" fill="#5B7FFF" />
          <rect x="36" y="12" width="3.5" height="24" rx="1.75" fill="#6B5FFF" opacity="0.8" />
          <rect x="42" y="18" width="3.5" height="12" rx="1.75" fill="#7C3FFF" opacity="0.6" />
        </svg>
        <span className="text-lg font-bold text-gray-900">ringa</span>
      </div>
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/home" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#3B6FFF]/10 text-[#3B6FFF]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        {/* Admin link — only for platform owner */}
        {company && ADMIN_EMAILS.includes(company.email) && (
          <>
            <div className="mx-3 my-2 border-t border-gray-200" />
            <Link
              href="/admin"
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-[#7C3FFF]/10 text-[#7C3FFF]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Shield className="h-5 w-5" />
              Admin Panel
            </Link>
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-200 p-4">
        {company && (
          <div className="mb-3 truncate text-xs text-gray-500">{company.name}</div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-gray-200 bg-white p-2 shadow-sm md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 rounded-lg p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
