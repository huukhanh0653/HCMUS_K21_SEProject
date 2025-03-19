import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { toast } from "react-toastify";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    systemName: "My App",
    contactEmail: "admin@example.com",
    enableFeatureX: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setSettings((prev) => ({ ...prev, enableFeatureX: !prev.enableFeatureX }));
  };

  const handleSave = () => {
    toast.success("Cài đặt đã được cập nhật!");
    console.log("Lưu cài đặt:", settings);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md sm:max-w-xl md:max-w-2xl shadow-lg rounded-lg p-6 bg-white dark:bg-gray-800">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Cài đặt hệ thống</h2>

          <div className="space-y-4">
            {/* Tên hệ thống */}
            <div className="flex items-center gap-4">
              <Label htmlFor="systemName" className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên hệ thống
              </Label>
              <Input
                id="systemName"
                name="systemName"
                value={settings.systemName}
                onChange={handleChange}
                className="w-2/3 mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
              />
            </div>

            {/* Email liên hệ */}
            <div className="flex items-center gap-4">
              <Label htmlFor="contactEmail" className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email liên hệ
              </Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-2/3 mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
              />
            </div>

            {/* Kích hoạt tính năng X */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kích hoạt tính năng X</Label>
              <Switch checked={settings.enableFeatureX} onCheckedChange={handleToggle} />
            </div>

            {/* Nút Lưu */}
            <Button className="w-full bg-black dark:bg-blue-600 text-white py-2 rounded-lg mt-4" onClick={handleSave}>
              Lưu cài đặt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
