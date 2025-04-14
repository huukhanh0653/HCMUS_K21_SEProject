import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function Admin() {
  return (
    <div className="flex flex-col min-h-screen w-full lg:flex-row">
      <AdminSidebar className="w-full lg:w-1/4" />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
