import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useState,useEffect } from "react";
import { DiscIcon, PowerIcon, ServerIcon, UsersIcon, PlayIcon, SettingsIcon, MenuIcon, XIcon } from "lucide-react";
import { cn } from "../../lib/utils"; // Hàm tiện ích để nối classnames

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 1800);

  // Theo dõi kích thước màn hình để cập nhật trạng thái Sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsHidden(window.innerWidth < 1800);
      if (window.innerWidth >= 1800) setIsOpen(false); // Đóng Sidebar khi mở rộng màn hình
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Nút mở Sidebar (Chỉ xuất hiện khi Sidebar bị ẩn) */}
      {isHidden && (
        <Button
          size="lg"
          variant="outline"
          className={cn(
            "fixed top-4 left- z-50 rounded-full border border-gray-300 bg-white shadow-md transition-all duration-300",
            isOpen ? "translate-x-60 opacity-0" : "opacity-100"
          )}
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon className="h-6 w-6 text-primary" />
        </Button>
      )}

      {/* Overlay để đóng Sidebar khi nhấn ra ngoài */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r bg-background transition-transform shadow-lg",
          isOpen || !isHidden ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/admin" className="flex items-center gap-2">
            <DiscIcon className="h-8 w-8 text-primary" />
            <span className="hidden text-lg font-bold text-primary sm:block">Discord</span>
          </Link>
          {/* Nút đóng Sidebar (chỉ hiện khi Sidebar mở) */}
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full sm:hidden transition-all duration-300 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-4">
          <NavItem to="/admin/dashboard" icon={<ServerIcon className="h-6 w-6" />} label="Dashboard" />
          <NavItem to="/admin/member" icon={<UsersIcon className="h-6 w-6" />} label="Members" />
          <NavItem to="/admin/server" icon={<PlayIcon className="h-6 w-6" />} label="Servers" />
          <NavItem to="/admin/setting" icon={<SettingsIcon className="h-6 w-6" />} label="Settings" />
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
      <span className="hidden text-sm font-medium sm:block">{label}</span>
    </Link>
  );
}