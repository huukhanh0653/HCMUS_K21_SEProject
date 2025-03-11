import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";   
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { toast } from "react-toastify";

export default function AdminAccountSettings() {
  const [account, setAccount] = useState({
    fullName: "Admin User",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
    enable2FA: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle2FA = () => {
    setAccount((prev) => ({ ...prev, enable2FA: !prev.enable2FA }));
  };

  const validateAndSave = () => {
    if (account.password && account.password !== account.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    toast.success("Thông tin tài khoản đã được cập nhật!");
    console.log("Lưu tài khoản:", account);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white shadow-lg rounded-lg p-6">
        <CardContent>
          <h2 className="text-xl font-bold text-center mb-6">Cài đặt tài khoản</h2>

          <div className="space-y-4">
            {/* Họ và tên */}
            <div>
              <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Họ và tên
              </Label>
              <Input id="fullName" name="fullName" value={account.fullName} onChange={handleChange} className="mt-1 w-full" />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input id="email" name="email" type="email" value={account.email} onChange={handleChange} className="mt-1 w-full" />
            </div>

            {/* Mật khẩu mới */}
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </Label>
              <Input id="password" name="password" type="password" value={account.password} onChange={handleChange} className="mt-1 w-full" />
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={account.confirmPassword} onChange={handleChange} className="mt-1 w-full" />
            </div>

            {/* Bật/Tắt 2FA */}
            <div className="flex items-center justify-between mt-4">
              <Label className="text-sm font-medium text-gray-700">Bật xác thực hai yếu tố (2FA)</Label>
              <Switch checked={account.enable2FA} onCheckedChange={handleToggle2FA} />
            </div>

            {/* Nút Lưu */}
            <Button className="w-full mt-6 bg-black text-white" onClick={validateAndSave}>
              Lưu thay đổi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
