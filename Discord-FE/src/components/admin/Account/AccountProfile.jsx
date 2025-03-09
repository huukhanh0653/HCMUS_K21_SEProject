import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function AccountProfile() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    avatar: "/placeholder.svg",
    name: "John Doe",
    email: "johndoe@example.com",
  });

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-sm sm:max-w-lg bg-white shadow-xl rounded-xl p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 bg-gray-200 text-sm">
              User Avatar
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 text-left m-1">Full Name</label>
              <Input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="mt-1 w-full bg-white text-black border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 text-left m-1">Email</label>
              <Input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="mt-1 w-full bg-white text-black border border-gray-300"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6">
              <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-1/2">
                Cancel
              </Button>
              <Button onClick={handleSave} className="w-full sm:w-1/2 bg-black text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}