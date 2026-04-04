import { useState, useEffect } from "react";
import { Menu, UserCircle, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  hideSearch?: boolean;
  title?: string;
  subtitle?: string;
}

const TopBar = ({ onMenuClick, showMenuButton = false, hideSearch = false, title, subtitle }: TopBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('layout');
  const { theme, toggleTheme } = useTheme();
  const [clock, setClock] = useState("");

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const getAbbreviatedName = () => {
    if (!user?.full_name) return '';
    const names = user.full_name.trim().split(' ');
    if (names.length >= 2) return `${names[0]} ${names[names.length - 1][0]}.`;
    return names[0];
  };

  const getUserInitials = () => {
    if (!user?.full_name) return 'U';
    const names = user.full_name.trim().split(' ');
    if (names.length >= 2) return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    return user.full_name[0].toUpperCase();
  };

  const getSettingsPath = () => {
    if (!user) return '/app/settings';
    switch (user.role) {
      case 'consultant': return '/consultant/settings';
      case 'admin': return '/admin/settings';
      default: return '/app/settings';
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    const roleMap: Record<string, { label: string; className: string }> = {
      admin: { label: "Admin", className: "bg-red-500/10 text-red-400 border-red-500/20" },
      consultant: { label: "Consultant", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    };
    const badge = roleMap[user.role];
    if (!badge) return null;
    return (
      <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded border", badge.className)}>
        {badge.label}
      </span>
    );
  };

  const handleLogout = () => { logout(); };

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-[var(--border-1)] bg-[var(--surface-1)]/80 backdrop-blur-xl px-4 lg:px-5">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)]"
          >
            <Menu className="h-4.5 w-4.5" />
          </Button>
        )}
        {title && (
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-foreground tracking-tight">{title}</h1>
            {subtitle && (
              <>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              </>
            )}
          </div>
        )}
        {getRoleBadge()}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Clock */}
        <span className="hidden sm:inline text-xs text-muted-foreground font-mono tabular-nums mr-2">
          {clock}
        </span>

        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)]"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <NotificationDropdown />

        <div className="h-5 w-px bg-[var(--border-1)] mx-1 hidden sm:block" />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[var(--surface-2)] transition-colors focus-visible:outline-none"
                aria-label={t('topbar.openAccountMenu')}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary leading-none">{getUserInitials()}</span>
                  </div>
                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-[var(--surface-1)]" />
                </div>
                <span className="text-xs font-medium text-foreground hidden sm:inline max-w-[100px] truncate">
                  {getAbbreviatedName() || t('topbar.accountFallback')}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 bg-[var(--surface-2)] border-[var(--border-1)]">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-foreground">{user.full_name}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-[var(--border-1)]" />
              <DropdownMenuItem onClick={() => navigate(getSettingsPath())} className="hover:bg-[var(--surface-3)]">
                <UserCircle className="h-4 w-4 mr-2" />
                {t('topbar.myProfile')}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[var(--border-1)]" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive hover:bg-[var(--surface-3)]">
                <LogOut className="h-4 w-4 mr-2" />
                {t('topbar.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default TopBar;
