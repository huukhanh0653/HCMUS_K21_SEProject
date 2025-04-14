import {
  HandPlatter,
  ConciergeBell,
  Receipt,
  ChartColumnIncreasing,
  CircleUserRound,
  Utensils,
  UtensilsCrossed,
  Contact,
  LifeBuoy,
  Send,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    role: "Admin",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  branch: {
    name: "SuShiX",
    server: "Chi nhánh 1",
    url: "#",
  },
  navManagement: [
    {
      title: "Thống kê",
      url: "",
      icon: ChartColumnIncreasing,
    },
    {
      title: "Thông tin người dùng",
      url: "/member",
      icon: CircleUserRound,
    },
    {
      title: "Danh sách người dùng",
      url: "/list-member",
      icon: Contact,
    },
  ],
  navSecondary: [
    {
      title: "Hướng dẫn sử dụng",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Báo cáo lỗi",
      url: "#",
      icon: Send,
    },
  ],
};

export default function DefaultLayout({ children }) {
  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </div>
  );
}
