import { Edit, Trash2 } from "lucide-react";
import SampleAvt from "../../../../assets/sample_avatar.svg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function MessageList({
    messages,
    username,
    editingMessageId,
    editedContent,
    setEditedContent,
    setEditingMessageId,
    handleDeleteMessage,
    handleSaveEdit,
    messagesWrapperRef,
    messagesEndRef,
}) {

  const user = JSON.parse(localStorage.getItem("user"));
  const { i18n } = useTranslation(); // ✅ Di chuyển vào trong đây

  // lấy danh sách memeber server từ redux
  const { serverMembers } = useSelector((state) => state.home);

  return (
    <div
      ref={messagesWrapperRef}
      className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      style={{
        minHeight: "200px",
        maxHeight: "calc(100vh - 100px)",
        scrollbarWidth: "thin",
        scrollbarColor: "grey transparent",
      }}
    >
      {messages.map((message, index) => {
        // normalize senderId from either field
        const senderId = message.sender_id ?? message.senderId;

        // date grouping logic
        const previous = messages[index - 1];
        const prevSenderId = previous && (previous.sender_id ?? previous.senderId);
        const currentDate = new Date(message.timestamp);
        const currentDay = currentDate.toDateString();
        const previousDay = previous ? new Date(previous.timestamp).toDateString() : null;
        const showDateDivider = currentDay !== previousDay;
        const isGrouped =
          previous &&
          prevSenderId === senderId &&
          previousDay === currentDay &&
          new Date(message.timestamp) - new Date(previous.timestamp) <= 60000;

        // formatted date/time
        const formattedDate = currentDate.toLocaleDateString(i18n.language, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const formattedTime = currentDate.toLocaleTimeString(i18n.language, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        // lookup member or fallback
        console.log("Sender ID:", senderId);
        console.log("Server Members:", serverMembers);
        const member = serverMembers.find((m) => m.id === senderId);
        const sender =
          senderId === user.id
            ? { username: user.username, avatar: user.avatar }
            : member
            ? { username: member.username, avatar: member.avatar }
            : { username: "User", avatar: SampleAvt };

        return (
          <div key={message.message_id} className={!isGrouped ? "pt-4" : ""}>
            {showDateDivider && (
              <div className="flex justify-center items-center my-6">
                <div className="border-t border-gray-600 flex-1" />
                <span className="px-4 text-sm text-gray-400">{formattedDate}</span>
                <div className="border-t border-gray-600 flex-1" />
              </div>
            )}

            <div className="relative group hover:bg-[#2e3035] rounded px-2 py-1 transition-colors duration-150">
              {!isGrouped && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#36393f] overflow-hidden flex-shrink-0">
                    <img
                      src={sender.avatar || SampleAvt}
                      alt={sender.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{sender.username}</span>
                      <span className="text-xs text-gray-400">{formattedTime}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pl-14 relative">
                {editingMessageId === message.messageId ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full bg-[#404249] text-gray-100 p-2 mt-1 rounded-md focus:outline-none resize-none break-words whitespace-pre-wrap pr-14"
                    rows={2}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveEdit(message.messageId);
                      }
                    }}
                  />
                ) : (
                  <p className="text-gray-100 break-words whitespace-pre-wrap break-all text-left pr-14">
                    {message.content}
                  </p>
                )}

                {message.senderId === user.id && (
                  <div className="absolute top-0 right-0 hidden group-hover:flex items-center gap-2">
                    <button
                      className="p-1 text-gray-400 hover:text-gray-200"
                      onClick={() => {
                        setEditingMessageId(message.messageId);
                        setEditedContent(message.content);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteMessage(message.messageId)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}
