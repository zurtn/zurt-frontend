import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo, memo } from "react";
import {
  LayoutDashboard, Link2, Wallet, CreditCard, TrendingUp, FileText, FilePlus, History,
  Target, Calculator, Settings, ChevronLeft, ChevronRight, Users, GitBranch, Shield,
  Activity, Clock, Receipt, Search, MessageSquare, DollarSign, UserPlus, Bell, Package,
  ChevronDown, ChevronUp, Globe, BarChart2, PieChart, LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

interface NavSubItem {
  label: string;
  href: string;
  enabled?: boolean;
  icon?: LucideIcon;
}

interface NavItem {
  icon: any;
  label: string;
  id?: string;
  href?: string;
  enabled?: boolean;
  subItems?: NavSubItem[];
  section?: string;
  iconClass?: string;
}

const Sidebar = memo(({ collapsed = false, onCollapse, mobileOpen = false, onMobileOpenChange }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { t } = useTranslation('layout');

  // Customer navigation items
  const customerNavItems: NavItem[] = useMemo(() => [
    { icon: LayoutDashboard, label: t('sidebar.nav.dashboard'), href: "/app/dashboard", enabled: true, section: t('sidebar.sections.principal') },
    { icon: Bell, label: t('sidebar.nav.notifications'), href: "/app/notifications", enabled: true, section: t('sidebar.sections.principal') },
    { icon: UserPlus, label: t('sidebar.nav.invitations'), href: "/app/invitations", enabled: true, section: t('sidebar.sections.principal') },
    { icon: MessageSquare, label: t('sidebar.nav.messages'), href: "/app/messages", enabled: true, section: t('sidebar.sections.principal') },
    { icon: Package, label: t('sidebar.nav.plans'), href: "/app/plans", enabled: true, section: t('sidebar.sections.principal') },
    { icon: PieChart, label: t('sidebar.nav.assets'), href: "/app/assets", enabled: true, section: t('sidebar.sections.financeiro') },
    {
      icon: Link2, label: t('sidebar.nav.connections'), id: "connections", enabled: true, section: t('sidebar.sections.financeiro'),
      subItems: [
        { label: t('sidebar.nav.openFinance'), href: "/app/connections/open-finance", enabled: true, icon: Globe },
      ],
    },
    { icon: Wallet, label: t('sidebar.nav.accounts'), href: "/app/accounts", enabled: true, section: t('sidebar.sections.financeiro') },
    { icon: Receipt, label: t('sidebar.nav.transactions'), href: "/app/transactions", enabled: true, section: t('sidebar.sections.financeiro') },
    { icon: CreditCard, label: t('sidebar.nav.cards'), href: "/app/cards", enabled: true, section: t('sidebar.sections.financeiro') },
    { icon: TrendingUp, label: t('sidebar.nav.investments'), href: "/app/investments", enabled: true, section: t('sidebar.sections.financeiro') },
    {
      icon: FileText, label: t('sidebar.nav.reports'), id: "reports", enabled: true, section: t('sidebar.sections.relatorios'),
      subItems: [
        { label: t('sidebar.nav.generateReport'), href: "/app/reports", enabled: true, icon: FilePlus },
        { label: t('sidebar.nav.history'), href: "/app/reports/history", enabled: true, icon: History },
      ],
    },
    { icon: Target, label: t('sidebar.nav.goals'), href: "/app/goals", enabled: true, section: t('sidebar.sections.relatorios') },
    { icon: Calculator, label: t('sidebar.nav.calculators'), href: "/app/calculators", enabled: true, section: t('sidebar.sections.ferramentas') },
  ], [t]);

  // Consultant navigation items
  const consultantNavItems: NavItem[] = useMemo(() => [
    { icon: LayoutDashboard, label: t('sidebar.nav.dashboard'), href: "/consultant/dashboard", enabled: true, section: t('sidebar.sections.principal') },
    { icon: Bell, label: t('sidebar.nav.notifications'), href: "/consultant/notifications", enabled: true, section: t('sidebar.sections.principal') },
    { icon: Package, label: t('sidebar.nav.plans'), href: "/consultant/plans", enabled: true, section: t('sidebar.sections.principal') },
    { icon: Users, label: t('sidebar.nav.clients'), href: "/consultant/clients", enabled: true, section: t('sidebar.sections.clientes') },
    { icon: GitBranch, label: t('sidebar.nav.pipeline'), href: "/consultant/pipeline", enabled: true, section: t('sidebar.sections.clientes') },
    { icon: UserPlus, label: t('sidebar.nav.sendInvitations'), href: "/consultant/invitations", enabled: true, section: t('sidebar.sections.clientes') },
    { icon: MessageSquare, label: t('sidebar.nav.messages'), href: "/consultant/messages", enabled: true, section: t('sidebar.sections.clientes') },
    { icon: FileText, label: t('sidebar.nav.reports'), href: "/consultant/reports", enabled: true, section: t('sidebar.sections.relatorios') },
    { icon: Calculator, label: t('sidebar.nav.calculators'), href: "/consultant/calculators", enabled: true, section: t('sidebar.sections.ferramentas') },
    { icon: TrendingUp, label: t('sidebar.nav.simulator'), href: "/consultant/simulator", enabled: true, section: t('sidebar.sections.ferramentas') },
  ], [t]);

  // Admin navigation items
  const adminNavItems: NavItem[] = useMemo(() => [
    { icon: LayoutDashboard, label: t('sidebar.nav.dashboard'), href: "/admin/dashboard", enabled: true, section: t('sidebar.sections.principal') },
    { icon: Bell, label: t('sidebar.nav.notifications'), href: "/admin/notifications", enabled: true, section: t('sidebar.sections.principal') },
    { icon: Shield, label: t('sidebar.nav.users'), href: "/admin/users", enabled: true, section: t('sidebar.sections.gestao') },
    { icon: Package, label: t('sidebar.nav.plans'), href: "/admin/plans", enabled: true, section: t('sidebar.sections.gestao') },
    { icon: DollarSign, label: t('sidebar.nav.financial'), href: "/admin/financial", enabled: true, section: t('sidebar.sections.gestao') },
    { icon: Activity, label: t('sidebar.nav.integrations'), href: "/admin/integrations", enabled: true, section: t('sidebar.sections.sistema') },
    { icon: MessageSquare, label: t('sidebar.nav.comments'), href: "/admin/comments", enabled: true, section: t('sidebar.sections.sistema') },
    { icon: Search, label: t('sidebar.nav.prospecting'), href: "/admin/prospecting", enabled: true, section: t('sidebar.sections.sistema') },
    { icon: Receipt, label: t('sidebar.nav.paymentHistory'), href: "/admin/payments", enabled: true, section: t('sidebar.sections.sistema') },
    { icon: Clock, label: t('sidebar.nav.loginHistory'), href: "/admin/login-history", enabled: true, section: t('sidebar.sections.sistema') },
  ], [t]);

  const getNavItems = () => {
    if (!user) return customerNavItems;
    switch (user.role) {
      case 'consultant': return consultantNavItems;
      case 'admin': return adminNavItems;
      default: return customerNavItems;
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/app/dashboard';
    switch (user.role) {
      case 'consultant': return '/consultant/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/app/dashboard';
    }
  };

  const navItems = getNavItems();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const isSubItemActive = (subItems?: NavSubItem[]): boolean => {
    if (!subItems) return false;
    return subItems.some(subItem => location.pathname === subItem.href);
  };

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  useEffect(() => {
    navItems.forEach(item => {
      if (item.subItems && isSubItemActive(item.subItems)) {
        setExpandedItems(prev => new Set(prev).add(item.id || item.label));
      }
    });
  }, [location.pathname]);

  const NavigationContent = ({ showLabels = true, onLinkClick }: { showLabels?: boolean; onLinkClick?: () => void }) => (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center h-12 shrink-0 border-b border-[var(--border-1)]",
        showLabels ? "justify-between px-4" : "justify-center relative px-0"
      )}>
        {showLabels ? (
          <Link to={getDashboardPath()} className="flex items-center gap-2.5 min-w-0" onClick={onLinkClick}>
            <img src="/logo.png" alt="ZURT Logo" className="h-7 w-7 object-contain shrink-0" />
            <span className="font-heading font-bold text-base tracking-tight">
              <span className="text-primary">z</span>
              <span className="text-foreground">urT</span>
            </span>
          </Link>
        ) : (
          <Link to={getDashboardPath()} className="flex shrink-0" onClick={onLinkClick}>
            <img src="/logo.png" alt="ZURT Logo" className="h-7 w-7 object-contain" />
          </Link>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className={cn(
              "h-6 w-6 shrink-0 text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)] rounded-md transition-all",
              !showLabels && "absolute right-1 top-1/2 -translate-y-1/2"
            )}
            aria-label={collapsed ? t('sidebar.expandMenu') : t('sidebar.collapseMenu')}
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 min-h-0">
        <nav className="px-2 py-2 space-y-0.5">
          {navItems.map((item, index) => {
            const showSectionLabel = showLabels && item.section && (index === 0 || navItems[index - 1]?.section !== item.section);
            const isEnabled = item.enabled !== false;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const itemKey = item.id || item.label;
            const isExpanded = expandedItems.has(itemKey);
            const isSubActive = isSubItemActive(item.subItems);
            const isActive = item.href
              ? location.pathname === item.href || location.pathname.startsWith(item.href + "/")
              : isSubActive;

            const sectionLabel = showSectionLabel && item.section ? (
              <div key={`section-${item.section}`} className="pt-4 pb-1 px-2 first:pt-0">
                <span className="sidebar-section-header">{item.section}</span>
              </div>
            ) : null;

            // Disabled items
            if (!isEnabled) {
              return (
                <React.Fragment key={item.label}>
                  {sectionLabel}
                  <div
                    className={cn(
                      "flex items-center gap-3 py-1.5 rounded-md text-xs font-medium cursor-not-allowed opacity-30",
                      showLabels ? "px-2.5" : "px-0 justify-center"
                    )}
                    title={t('sidebar.comingSoon')}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {showLabels && <span>{item.label}</span>}
                  </div>
                </React.Fragment>
              );
            }

            // Collapsed sidebar with submenus -> dropdown
            if (hasSubItems && !showLabels) {
              return (
                <React.Fragment key={item.label}>
                  {sectionLabel}
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <DropdownMenu>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <button
                              className={cn(
                                "sidebar-nav-item w-full flex flex-col items-center justify-center gap-0.5 px-0 py-1.5 text-xs font-medium rounded-md",
                                isActive ? "active bg-[hsl(var(--sidebar-active-bg))] text-primary" : "text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)]"
                              )}
                              title={item.label}
                            >
                              <item.icon className={cn("h-4 w-4", isActive && "text-primary", item.iconClass)} />
                              <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                            </button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8} className="text-xs">
                          {item.label}
                        </TooltipContent>
                        <DropdownMenuContent side="right" align="start" sideOffset={8} className="min-w-[11rem] bg-[var(--surface-2)] border-[var(--border-1)]">
                          <DropdownMenuLabel className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</DropdownMenuLabel>
                          {item.subItems!.map((subItem) => {
                            const isSubActive = location.pathname === subItem.href;
                            if (subItem.enabled === false) {
                              return (
                                <DropdownMenuItem key={subItem.href} disabled className="opacity-40">
                                  {subItem.icon && <subItem.icon className="mr-2 h-3.5 w-3.5" />}
                                  {subItem.label}
                                </DropdownMenuItem>
                              );
                            }
                            const SubIcon = subItem.icon;
                            return (
                              <DropdownMenuItem
                                key={subItem.href}
                                onClick={() => { navigate(subItem.href); onLinkClick?.(); }}
                                className={cn("flex items-center gap-2 hover:bg-[var(--surface-3)]", isSubActive && "bg-[hsl(var(--sidebar-active-bg))] font-medium text-primary")}
                              >
                                {SubIcon && <SubIcon className="h-3.5 w-3.5" />}
                                {subItem.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Tooltip>
                  </TooltipProvider>
                </React.Fragment>
              );
            }

            // Expanded sidebar with submenus -> expandable
            if (hasSubItems && showLabels) {
              return (
                <React.Fragment key={item.label}>
                  {sectionLabel}
                  <div>
                    <button
                      onClick={() => toggleExpanded(itemKey)}
                      className={cn(
                        "sidebar-nav-item w-full flex items-center justify-between gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded-md",
                        isActive ? "active bg-[hsl(var(--sidebar-active-bg))] text-primary" : "text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className={cn("h-4 w-4", isActive && "text-primary", item.iconClass)} />
                        <span>{item.label}</span>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="h-3 w-3 opacity-40" />
                        : <ChevronDown className="h-3 w-3 opacity-40" />
                      }
                    </button>
                    {isExpanded && (
                      <div className="ml-[18px] mt-0.5 space-y-0.5 border-l border-[var(--border-1)]/50 pl-2.5 ml-4">
                        {item.subItems!.map((subItem) => {
                          const isSubActive = location.pathname === subItem.href;
                          if (subItem.enabled === false) {
                            const DisabledSubIcon = subItem.icon;
                            return (
                              <div key={subItem.href} className="flex items-center gap-2 px-2 py-1 text-[11px] text-muted-foreground opacity-30 cursor-not-allowed">
                                {DisabledSubIcon && <DisabledSubIcon className="h-3 w-3" />}
                                <span>{subItem.label}</span>
                              </div>
                            );
                          }
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              onClick={onLinkClick}
                              className={cn(
                                "flex items-center gap-2 px-2 py-1 text-[11px] rounded-md transition-colors",
                                isSubActive
                                  ? "bg-[hsl(var(--sidebar-active-bg))] text-primary font-medium"
                                  : "text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)]"
                              )}
                            >
                              {SubIcon && <SubIcon className="h-3 w-3 opacity-60" />}
                              <span>{subItem.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            }

            // Regular items — with tooltip in collapsed mode
            const linkContent = (
              <Link
                to={item.href || '#'}
                onClick={onLinkClick}
                className={cn(
                  "sidebar-nav-item flex items-center gap-2.5 py-1.5 text-xs font-medium relative rounded-md",
                  showLabels ? "px-2.5" : "px-0 justify-center",
                  isActive ? "active bg-[hsl(var(--sidebar-active-bg))] text-primary" : "text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)]"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-primary" />
                )}
                <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary", item.iconClass)} />
                {showLabels && <span>{item.label}</span>}
              </Link>
            );

            if (!showLabels) {
              return (
                <React.Fragment key={item.href || item.label}>
                  {sectionLabel}
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8} className="text-xs">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={item.href || item.label}>
                {sectionLabel}
                {linkContent}
              </React.Fragment>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="shrink-0 border-t border-[var(--border-1)]">
        <button
          onClick={() => { logout(); onLinkClick?.(); }}
          className={cn(
            "sidebar-nav-item flex items-center gap-2.5 py-2.5 text-xs font-medium text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)] w-full transition-colors",
            showLabels ? "px-4" : "px-0 justify-center"
          )}
        >
          <LogOut className="h-4 w-4" />
          {showLabels && <span>{t('topbar.logout')}</span>}
        </button>
      </div>
    </>
  );

  // Mobile — Sheet overlay
  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 p-0 bg-[var(--bg)] text-sidebar-foreground border-[var(--border-1)]/50" data-sidebar="true">
          <VisuallyHidden.Root asChild>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden.Root>
          <div className="flex flex-col h-full">
            <NavigationContent showLabels={true} onLinkClick={() => onMobileOpenChange?.(false)} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop — Rail (60px) / Expanded (240px)
  return (
    <aside
      data-sidebar="true"
      className={cn(
        "hidden lg:flex flex-col h-screen bg-[var(--bg)] text-sidebar-foreground transition-all duration-300 sticky top-0 border-r border-[var(--border-1)]",
        collapsed ? "w-[60px]" : "w-60"
      )}
    >
      <NavigationContent showLabels={!collapsed} />
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
