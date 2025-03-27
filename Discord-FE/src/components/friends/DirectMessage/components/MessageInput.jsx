import { Plus, SmilePlus } from "lucide-react";

export default function MessageInput({
  messageInput,
  setMessageInput,
  handleSendMessage,
  t,
  friend,
  inputRef,
}) {
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#383a40] rounded-lg p-2">
      <div className="flex items-center">
        <button className="p-2 hover:bg-[#404249] rounded-lg">
          <Plus size={20} className="text-gray-200" />
        </button>
        <textarea
          ref={inputRef}
          value={messageInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={`${t("Message @")}${friend?.name || ""}`}
          className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none"
          rows={1}
          style={{
            minHeight: "40px",
            height: "40px",
            maxHeight: "120px",
          }}
        />
        <button
          className="p-2 hover:bg-[#404249] rounded-lg"
          onClick={handleSendMessage}
        >
          <SmilePlus size={20} className="text-gray-200" />
        </button>
      </div>
    </div>
  );
}
