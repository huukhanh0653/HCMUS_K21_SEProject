import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export default function AdminAccountSettings() {
  const [account, setAccount] = useState({
    fullName: "Admin User",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
    enable2FA: false,
  });
  const { t } = useTranslation();
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
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <CardContent>
          <h2 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            Cài đặt tài khoản
          </h2>

          <div className="space-y-4">
            {/* Họ và tên */}
            <div className="flex items-center space-x-4">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32"
              >
                {t("Username")}
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={account.fullName}
                onChange={handleChange}
                className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md"
              />
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={account.email}
                onChange={handleChange}
                className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md"
              />
            </div>

            {/* Mật khẩu mới */}
            <div className="flex items-center space-x-4">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32"
              >
                {t("New Password")}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={account.password}
                onChange={handleChange}
                className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md"
              />
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="flex items-center space-x-4">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 w-32"
              >
                {t("Confirm")}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={account.confirmPassword}
                onChange={handleChange}
                className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md"
              />
            </div>

            {/* Bật/Tắt 2FA */}
            <div className="flex items-center justify-between mt-4">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Enable Two factor authentication")} (2FA)
              </Label>
              <Switch
                checked={account.enable2FA}
                onCheckedChange={handleToggle2FA}
              />
            </div>

            {/* Nút Lưu */}
            <Button
              className="w-full mt-6 bg-black dark:bg-blue-600 text-white dark:text-gray-100"
              onClick={validateAndSave}
            >
              {t("Save Changes")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
