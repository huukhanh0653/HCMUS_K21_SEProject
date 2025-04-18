import { useState, useMemo, useEffect } from "react";
import { X, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import Hashids from "hashids";
import UserService from "../../services/UserService";
import ServerChannelService from "../../services/ServerChannelService";

export default function InviteServerModal({ server, isOpen, onClose }) {
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
        const data = await UserService.getFriends(user.id);
        setFriends(data || []);
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

  // Generate server code
  const serverCode = useMemo(() => {
    try {
      const hex = server.id.replace(/-/g, "").toLowerCase();
      return hashids.encodeHex(hex);
    } catch {
      return hashids.encode(
        ...server.id.split("").map((ch) => ch.charCodeAt(0))
      );
    }
  }, [hashids, server.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Invite friend into server
  const handleInvite = async (friend) => {
    setInviteLoading(friend.id);
    setInviteError(null);
    console.log("Friend invited:", friend);
    try {
      await ServerChannelService.addServerMember(
        server.id,
        user.id,
        { memberId: friend.id, role: "Member" }
      );
      // Remove friend from list after inviting
      setFriends((prev) => prev.filter((f) => f.id !== friend.id));
    } catch (err) {
      console.error("Failed to invite:", err);
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
        {copied && <span className="text-green-400 block mb-2">{t("Copied")}</span>}

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
                {inviteLoading === friend.id
                  ? t("Inviting...")
                  : t("Invite")}
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
