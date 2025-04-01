import { Plus, Gift, ImageIcon, Sticker, SmilePlus } from "lucide-react";

export default function MessageInput({
    value,          // instead of messageInput
    onChange,       // instead of setMessageInput
    onSend,         // instead of handleSendMessage
    t,
    channelName,
    inputRef
  }) {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-[#383a40] rounded-lg p-2">
        <div className="flex items-center">
          <button className="p-2 hover:bg-[#404249] rounded-lg">
            <Plus size={20} className="text-gray-200" />
          </button>
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "40px";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend(); // 🔥 This will now call the correct function
              }
            }}
            placeholder={`${t("Message #")}${channelName}`}
            className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none overflow-y-auto"
            style={{
              minHeight: "40px",
              height: "40px",
              maxHeight: "120px",
            }}
          />
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <Gift size={20} className="text-gray-200" />
            </button>
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <ImageIcon size={20} className="text-gray-200" />
            </button>
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <Sticker size={20} className="text-gray-200" />
            </button>
            <button className="p-2 hover:bg-[#404249] rounded-lg" onClick={onSend}>
              <SmilePlus size={20} className="text-gray-200" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  

