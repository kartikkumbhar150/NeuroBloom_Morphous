"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity,
  LayoutDashboard,
  FileText,
  Stethoscope,
  Settings,
  HelpCircle,
  Compass
} from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

function NavItem({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`
        flex items-center gap-4 px-4 py-3 border-2 border-black transition-all group cursor-pointer
        ${active ? 'bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-black hover:bg-accent shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px]'}
      `}>
        <span className={active ? 'text-white' : 'text-black group-hover:scale-110 transition-transform'}>{icon}</span>
        <span className={`hidden lg:block text-sm uppercase tracking-widest ${active ? 'font-black' : 'font-bold'}`}>{label}</span>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <aside className="w-20 lg:w-64 bg-card border-r-4 border-black flex flex-col h-screen shrink-0">
      <div className="p-6 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Activity className="text-white w-6 h-6" />
        </div>
        <span className="hidden lg:block font-black text-xl tracking-tight text-foreground uppercase">NeuroBloom</span>
      </div>
      
      <nav className="flex-1 px-3 space-y-2">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label={t("nav_overview") || "Overview"}
          href="/dashboard"
          active={pathname === "/dashboard"}
        />
        <NavItem
          icon={<FileText size={20} />}
          label={t("nav_reports") || "Reports"}
          href="/assessments"
          active={pathname === "/assessments"}
        />
        <NavItem
          icon={<Stethoscope size={20} />}
          label="Psychologists"
          href="/psychologists"
          active={pathname === "/psychologists"}
        />
        <NavItem
          icon={<Compass size={20} />}
          label={t("nav_personalist") || "Paths"}
          href="/personalised-path"
          active={pathname === "/personalised-path"}
        />
      </nav>

      <div className="p-3 border-t-4 border-black space-y-2">
        <NavItem icon={<Settings size={20} />} label="Settings" href="/settings" active={pathname === "/settings"} />
        <NavItem icon={<HelpCircle size={20} />} label="Support" href="/support" active={pathname === "/support"} />
      </div>
    </aside>
  );
}
