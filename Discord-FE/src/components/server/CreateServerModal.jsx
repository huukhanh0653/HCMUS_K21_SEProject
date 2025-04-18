import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ServerChannelService from "../../services/ServerChannelService";
import StorageService from "../../services/StorageService";

export default function CreateServerModal({ onClose, onCreated }) {
  const [modalType, setModalType] = useState("main");
  const [serverName, setServerName] = useState("");
  const [serverImageFile, setServerImageFile] = useState(null);
  const [serverImagePreview, setServerImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setServerImageFile(file);
      setServerImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!serverName.trim()) newErrors.name = t("Server name is required");
    if (!serverImageFile) newErrors.image = t("Server icon is required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      if (!userId) throw new Error(t("User not logged in"));

      let imageUrl = "";
      if (serverImageFile) {
        imageUrl = await StorageService.uploadFile(serverImageFile);
        if (!imageUrl) {
          throw new Error(t("Failed to upload server icon"));
        }
      }

      const payload = {
        name: serverName.trim(),
        serverPic:
          imageUrl ||
          "https://lh3.googleusercontent.com/a/ACg8ocKmMo19Vt1WHo_oM9THY1GmiP2JzCHh2LAbFy_6ErY0Q8OpAQ=s96-c",
      };

      const newServer = await ServerChannelService.createServer(
        userId,
        payload
      );
      if (onCreated) onCreated(newServer);
      onClose();
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        submit: err.response?.data?.message || err.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#313338] rounded-md w-full max-w-md p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-400 hover:text-gray-100 hover:bg-gray-600"
        >
          <X size={20} />
        </button>

        {modalType === "main" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t("Create Your Server")}
              </h2>
              <p className="text-gray-400">
                {t(
                  "Your server is where you and your friends hang out. Make yours and start talking."
                )}
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setModalType("create")}
                className="w-full bg-[#2b2d31] hover:bg-[#35373c] p-4 rounded-md flex items-center gap-4 transition-colors"
              >
                <div className="text-white font-medium">
                  {t("Create My Own")}
                </div>
                <div className="ml-auto text-gray-400">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                    />
                  </svg>
                </div>
              </button>
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase mb-2">
                  {t("Have an invite already?")}
                </div>
                <button
                  onClick={() => setModalType("join")}
                  className="w-full bg-[#404249] hover:bg-[#35373c] text-white p-2 rounded-md transition-colors"
                >
                  {t("Join a server")}
                </button>
              </div>
            </div>
          </>
        )}

        {modalType === "create" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t("Customize Your Server")}
              </h2>
              <p className="text-gray-400">
                {t(
                  "Give your new server a personality with a name and an icon. You can always change it later."
                )}
              </p>
            </div>
            <div className="flex justify-center mb-4">
              <label className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer">
                {serverImagePreview ? (
                  <img
                    src={serverImagePreview}
                    alt="Server Icon"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">{t("UPLOAD")}</span>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="absolute -bottom-2 right-0 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-white">
                  +
                </div>
              </label>
            </div>
            {errors.image && (
              <div className="text-red-500 text-sm mb-2">{errors.image}</div>
            )}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">
                {t("SERVER NAME")}
              </label>
              <input
                type="text"
                className="w-full bg-[#1e1f22] text-white p-2 rounded-md outline-none"
                placeholder={t("Enter server name")}
                value={serverName}
                onChange={(e) => {
                  setServerName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
            </div>
            {errors.name && (
              <div className="text-red-500 text-sm mb-2">{errors.name}</div>
            )}
            {errors.submit && (
              <div className="text-red-500 text-sm mb-2">{errors.submit}</div>
            )}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setModalType("main")}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {t("Back")}
              </button>
              <button
                onClick={handleCreate}
                disabled={isLoading || !serverName.trim() || !serverImageFile}
                className={`bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center transition-colors ${
                  isLoading || !serverName.trim() || !serverImageFile
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLoading ? t("Creating...") : t("Create")}
              </button>
            </div>
          </>
        )}

        {modalType === "join" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t("Join a server")}
              </h2>
              <p className="text-gray-400">
                {t("Enter an invite below to join an existing server")}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">
                {t("INVITE LINK")} *
              </label>
              <input
                type="text"
                className="w-full bg-[#1e1f22] text-white p-2 rounded-md outline-none"
                placeholder="https://discord.gg/example"
              />
            </div>
            <div className="mb-4 text-gray-400 text-sm">
              <p className="mb-1">{t("INVITES SHOULD LOOK LIKE")}</p>
              <ul className="list-none">
                <li>hTKzmak</li>
                <li>https://discord.gg/hTKzmak</li>
                <li>https://discord.gg/wumpus-friends</li>
              </ul>
            </div>
            <div className="bg-[#2b2d31] p-3 rounded-md flex items-center">
              <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center text-white mr-2">
                ✅
              </div>
              <span className="text-gray-400 text-sm">
                {t("Don't have an invite?")}
              </span>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setModalType("main")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t("Back")}
              </button>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
                {t("Join Server")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
