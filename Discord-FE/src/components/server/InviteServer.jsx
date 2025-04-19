import { useState, useMemo, useEffect } from "react";
import { X, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import Hashids from "hashids";
import UserService from "../../services/UserService";
import ServerChannelService from "../../services/ServerChannelService";
import toast from "react-hot-toast";

export default function InviteServerModal({
  server,
  isOpen,
  onClose,
  onInviteSuccess,
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [friends, setFriends] = useState([]);
  const [inviteLoading, setInviteLoading] = useState(null);
  const [inviteError, setInviteError] = useState(null);

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch friends when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchFriends = async () => {
      try {
        const friends = await UserService.getFriends(user.id);
        const { members } = await ServerChannelService.searchServerMember(
          server.id
        );

        const memberIds = new Set(members.map((member) => member.id));
        const nonServerFriends = friends.filter(
          (friend) => !memberIds.has(friend.id)
        );

        setFriends(nonServerFriends || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, [isOpen, user.id]);

  // Hashids for server code
  const hashids = useMemo(() => {
    const key = import.meta.env.VITE_SERVER_HASH_KEY || "";
    return new Hashids(key, 8);
  }, []);

  // Bảo vệ server.id trước khi tính code
  const serverId = server?.id || "";
  // Generate server code
  const serverCode = useMemo(() => {
    if (!serverId) return "";
    // loại bỏ dấu '-' để có chuỗi hex thuần
    const hex = serverId.replace(/-/g, "").toLowerCase();
    // Nếu encodeHex fail, fallback encode ký tự
    try {
      return hashids.encodeHex(hex);
    } catch {
      const codes = hex.split("").map((ch) => ch.charCodeAt(0));
      return hashids.encode(...codes);
    }
  }, [hashids, serverId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Invite friend into server
  const handleInvite = async (friend) => {
    setInviteLoading(friend.id);
    setInviteError(null);
    try {
      // Gọi đúng theo định nghĩa trong ServerChannelService:
      const { message } = await ServerChannelService.addServerMember(
        server.id,
        user.id,
        {
          memberId: friend.id,
          role: "Member",
        }
      );
      // Sau khi mời thành công, loại bỏ bạn khỏi list (nếu bị ban thì không loại bỏ)
      if (message !== "This user has been banned in this server") {
        setFriends((prev) => prev.filter((f) => f.id !== friend.id));
        toast.success(t("Invited member successfully"));
        onInviteSuccess();
        return;
      }

      toast.error(t(message));
    } catch (err) {
      toast.error("Failed to invite:", err);
      setInviteError(err.response?.data?.message || err.message);
    } finally {
      setInviteLoading(null);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#2b2d31] w-96 p-5 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">
          {t("Invite to server")}
        </h2>

        {/* Server code */}
        <div className="w-full bg-[#1e1f22] p-2 rounded-md flex items-center justify-center mb-2 relative">
          <span className="text-gray-300">{serverCode}</span>
          <button
            onClick={copyToClipboard}
            className="absolute right-2 text-gray-400 hover:text-white flex items-center gap-1"
          >
            <Copy size={18} />
          </button>
        </div>
        {copied && (
          <span className="text-green-400 block mb-2">{t("Copied")}</span>
        )}

        {/* Friends list */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex justify-between items-center bg-[#3b3e45] p-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <img
                  src={friend.avatar}
                  alt={friend.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white">{friend.username}</span>
              </div>
              <button
                onClick={() => handleInvite(friend)}
                disabled={inviteLoading === friend.id}
                className={`px-3 py-1 rounded-md text-sm ${
                  inviteLoading === friend.id
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {inviteLoading === friend.id ? t("Inviting...") : t("Invite")}
              </button>
            </div>
          ))}
          {inviteError && (
            <div className="text-red-500 text-sm mt-2">{inviteError}</div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
        >
          {t("Close")}
        </button>
      </div>
    </div>
  );
}
