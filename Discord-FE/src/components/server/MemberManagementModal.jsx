import { useState, useEffect } from "react";
import { Search, UserX, ShieldOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import ServerChannelService from "../../services/ServerChannelService";
import toast from "react-hot-toast";

export default function MemberManagementModal({
  server,
  members,
  isOpen,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [memberList, setMemberList] = useState(members);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    action: null,
    memberId: null,
    memberUsername: null,
    reason: "",
  });
  const { t } = useTranslation();
  const userId = JSON.parse(localStorage.getItem("user")).id;

  // Đóng modal khi ấn ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (confirmationModal.isOpen) {
          setConfirmationModal({
            isOpen: false,
            action: null,
            memberId: null,
            memberUsername: null,
            reason: "",
          });
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, confirmationModal.isOpen]);

  // Cập nhật memberList khi members prop thay đổi
  useEffect(() => {
    setMemberList(members);
  }, [members]);

  if (!isOpen) return null;

  // Hàm xử lý kick
  const handleKick = async (id) => {
    try {
      await ServerChannelService.removeServerMember(server.id, userId, id);
      setMemberList(memberList.filter((member) => member.id !== id));
      toast.success(t("Member kicked successfully"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  // Hàm xử lý ban
  const handleBan = async (id, reason) => {
    try {
      await ServerChannelService.addBan({
        serverId: server.id,
        userId: id,
        reason,
      });
      await ServerChannelService.removeServerMember(server.id, userId, id);
      setMemberList(memberList.filter((member) => member.id !== id));
      toast.success(t("Member banned successfully"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  // Hàm mở modal xác nhận
  const openConfirmationModal = (action, memberId, memberUsername) => {
    setConfirmationModal({
      isOpen: true,
      action,
      memberId,
      memberUsername,
      reason: "",
    });
  };

  // Hàm xử lý xác nhận hành động
  const confirmAction = async () => {
    const { action, memberId, reason } = confirmationModal;
    if (action === "kick") {
      await handleKick(memberId);
    } else if (action === "ban") {
      await handleBan(memberId, reason);
    }
    setConfirmationModal({
      isOpen: false,
      action: null,
      memberId: null,
      memberUsername: null,
      reason: "",
    });
  };

  // Hàm xử lý thay đổi reason
  const handleReasonChange = (e) => {
    setConfirmationModal((prev) => ({
      ...prev,
      reason: e.target.value,
    }));
  };

  return (
    <>
      {/* Modal chính */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
        <div className="bg-[#2b2d31] p-4 rounded-md w-96 shadow-lg">
          <h2 className="text-white text-lg font-semibold mb-2">
            {t("Manage Members")}
          </h2>

          {/* Search Bar */}
          <div className="flex items-center bg-[#1e1f22] p-2 rounded-md mb-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder={t("Find member....")}
              className="bg-transparent text-white flex-1 ml-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Members List */}
          <div
            className="max-h-60 overflow-y-auto overflow-x-hidden pt-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "grey transparent",
            }}
          >
            {memberList
              .filter((member) =>
                member.username.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 hover:bg-[#35373c] rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white">{member.username}</span>
                  </div>
                  {server.owner_id === userId && (
                    <div className="flex gap-2">
                      {/* Kick Button */}
                      <button
                        className="text-red-500 hover:text-red-700 relative group"
                        onClick={() =>
                          openConfirmationModal(
                            "kick",
                            member.id,
                            member.username
                          )
                        }
                      >
                        <UserX size={20} />
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          {t("Kick")}
                        </span>
                      </button>

                      {/* Ban Button */}
                      <button
                        className="text-yellow-500 hover:text-yellow-700 relative group"
                        onClick={() =>
                          openConfirmationModal(
                            "ban",
                            member.id,
                            member.username
                          )
                        }
                      >
                        <ShieldOff size={20} />
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          {t("Ban")}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            {t("Close")}
          </button>
        </div>
      </div>

      {/* Modal xác nhận */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-[#2b2d31] p-4 rounded-md w-80 shadow-lg text-white">
            <h3 className="text-lg font-semibold mb-2">
              {t("Confirm")} {t(`${confirmationModal.action}`)}
            </h3>
            <p className="text-gray-300 mb-4">
              {t("Are you sure you want to")} {t(`${confirmationModal.action}`)}{" "}
              <span className="font-semibold">
                {confirmationModal.memberUsername}
              </span>
              ?
            </p>
            {confirmationModal.action === "ban" && (
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">
                  {t("Reason")} ({t("optional")})
                </label>
                <input
                  type="text"
                  value={confirmationModal.reason}
                  onChange={handleReasonChange}
                  placeholder={t("Enter ban reason...")}
                  className="w-full p-2 bg-[#1e1f22] text-white rounded-md outline-none"
                />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={confirmAction}
                className={`flex-1 py-2 rounded-md ${
                  confirmationModal.action === "kick"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                } text-white`}
              >
                {t("Confirm")}
              </button>
              <button
                onClick={() =>
                  setConfirmationModal({
                    isOpen: false,
                    action: null,
                    memberId: null,
                    memberUsername: null,
                    reason: "",
                  })
                }
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
