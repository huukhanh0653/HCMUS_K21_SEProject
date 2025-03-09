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
      <Card className="w-full max-w-md sm:max-w-xl md:max-w-2xl shadow-lg rounded-lg p-6 bg-white">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-6">Cài đặt hệ thống</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="systemName" className="block text-sm font-medium text-gray-700">Tên hệ thống</Label>
              <Input
                id="systemName"
                name="systemName"
                value={settings.systemName}
                onChange={handleChange}
                className="w-full mt-1 border-gray-300 rounded-md"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Email liên hệ</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full mt-1 border-gray-300 rounded-md"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Kích hoạt tính năng X</Label>
              <Switch checked={settings.enableFeatureX} onCheckedChange={handleToggle} />
            </div>

            <Button className="w-full bg-black text-white py-2 rounded-lg mt-4" onClick={handleSave}>
              Lưu cài đặt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
