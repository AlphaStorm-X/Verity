"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, Search, GitCompare, PlayCircle, Activity, CheckCircle2 } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Command Center", href: "/", icon: LayoutDashboard },
    { label: "Investigation", href: "/transactions/tx_canonical_retry_001", icon: Search },
    { label: "Compare (Naive vs VERITY)", href: "/compare/tx_canonical_retry_001", icon: GitCompare },
    { label: "Simulation Center", href: "/simulate", icon: PlayCircle },
    { label: "Live Incident", href: "/live/run_demo_001", icon: Activity },
    { label: "Reliability", href: "/reliability", icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-blue-600/20 text-blue-400 p-2 rounded-lg border border-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">VERITY</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              TRUTH ENGINE
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("/")[1]));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
