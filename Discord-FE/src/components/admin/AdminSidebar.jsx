import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DiscIcon,
  ServerIcon,
  UsersIcon,
  PlayIcon,
  SettingsIcon,
  XIcon,
  Languages,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import { useTheme } from "../layout/ThemeProvider";
import { useLanguage } from "../layout/LanguageProvider";

export default function AdminSidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  return (
    <>
      {/* Overlay để đóng Sidebar khi nhấn ra ngoài */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r bg-background transition-transform shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <article className="flex items-center gap-2">
            <DiscIcon className="h-8 w-8 text-primary" />
            <span className="hidden text-lg font-bold text-primary sm:block">
              EchoChat
            </span>
          </article>

          {/* Nút đóng Sidebar */}
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full transition-all duration-300 hover:bg-gray-200"
            onClick={onClose}
          >
            <XIcon className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-4">
          <NavItem
            to="/admin"
            icon={<ServerIcon className="h-6 w-6" />}
            label={t("Dashboard")}
          />
          <NavItem
            to="/admin/member"
            icon={<UsersIcon className="h-6 w-6" />}
            label={t("Members")}
          />
          <NavItem
            to="/admin/server"
            icon={<PlayIcon className="h-6 w-6" />}
            label={t("Servers")}
          />
          <NavItem
            to="/admin/setting"
            icon={<SettingsIcon className="h-6 w-6" />}
            label={t("Settings")}
          />
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Languages />
            <span className="text-sm font-medium">
              {language === "en" ? "EN" : "VI"}
            </span>
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isDarkMode ? "☀️" : "🌙"}
            <span className="text-sm font-medium">{t("Theme")}</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 p-2 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      prefetch={false}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
