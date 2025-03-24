import { Button } from "../ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "../ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth"; // Firebase auth

export default function AdminHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        console.log("User logged out");
        navigate("/login"); // Redirect to login page
      } catch (error) {
        console.error("Logout failed:", error.message);
      }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Toggle Sidebar Button */}
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-red-500 text-white"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="#" className="cursor-pointer text-2xl">Admin</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img
                  src="/placeholder.svg"
                  width="32"
                  height="32"
                  className="rounded-full"
                  alt="Avatar"
                  style={{ aspectRatio: "32/32", objectFit: "cover" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>John Doe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/account/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/account/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
