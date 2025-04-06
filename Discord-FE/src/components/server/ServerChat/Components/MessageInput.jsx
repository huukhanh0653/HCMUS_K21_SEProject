import { Plus, Gift, ImageIcon, Sticker, SmilePlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Danh sách user mẫu
const SAMPLE_USERS = [
  { id: 1, name: "TanPhat", username: "tanphat" },
  { id: 2, name: "TanTai", username: "tantai" },
  { id: 3, name: "ThanhTam", username: "thanhtam" }
];

export default function MessageInput({
    value,          // instead of messageInput
    onChange,       // instead of setMessageInput
    onSend,         // instead of handleSendMessage
    t,
    channelName,
    inputRef
  }) {
    const [showMentions, setShowMentions] = useState(false);
    const [mentionFilter, setMentionFilter] = useState("");
    const [mentionUsers, setMentionUsers] = useState(SAMPLE_USERS);
    const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
    const mentionListRef = useRef(null);

    // Xử lý việc lọc users khi gõ @ và các ký tự tiếp theo
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Tìm vị trí @ gần nhất
        const lastAtSymbol = newValue.lastIndexOf('@');
        if (lastAtSymbol !== -1) {
            const textAfterAt = newValue.slice(lastAtSymbol + 1);
            const wordAfterAt = textAfterAt.split(' ')[0];
            
            if (wordAfterAt) {
                setMentionFilter(wordAfterAt.toLowerCase());
                const filtered = SAMPLE_USERS.filter(user => 
                    user.name.toLowerCase().includes(wordAfterAt.toLowerCase())
                );
                setMentionUsers(filtered);
                setShowMentions(filtered.length > 0);
                setSelectedMentionIndex(0);
            } else {
                setMentionUsers(SAMPLE_USERS);
                setShowMentions(true);
                setMentionFilter("");
            }
        } else {
            setShowMentions(false);
        }
    };

    // Xử lý phím tắt
    const handleKeyDown = (e) => {
        if (showMentions) {
            if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                insertMention(mentionUsers[selectedMentionIndex]);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedMentionIndex(prev => 
                    prev < mentionUsers.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : prev);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    // Chèn mention vào input
    const insertMention = (user) => {
        const lastAtSymbol = value.lastIndexOf('@');
        const newValue = value.slice(0, lastAtSymbol) + `@${user.name} `;
        onChange(newValue);
        setShowMentions(false);
    };

    // Hàm để highlight mentions trong text
    const getHighlightedText = (text) => {
        const parts = [];
        let lastIndex = 0;
        const mentionRegex = /@([A-Za-z]+)/g;
        let match;

        while ((match = mentionRegex.exec(text)) !== null) {
            // Thêm text thường trước mention
            if (match.index > lastIndex) {
                parts.push({
                    text: text.slice(lastIndex, match.index),
                    isMention: false
                });
            }
            // Thêm phần mention
            parts.push({
                text: match[0], // @Username
                isMention: true
            });
            lastIndex = match.index + match[0].length;
        }
        // Thêm phần text còn lại
        if (lastIndex < text.length) {
            parts.push({
                text: text.slice(lastIndex),
                isMention: false
            });
        }
        return parts;
    };

    return (
      <div className="absolute bottom-0 left-0 right-0 bg-[#383a40] rounded-lg p-2">
        <div className="flex items-center relative">
          <button className="p-2 hover:bg-[#404249] rounded-lg">
            <Plus size={20} className="text-gray-200" />
          </button>
          <div className="relative flex-1">
            {/* Div giả để hiển thị text đã highlight */}
            <div 
                className="absolute inset-0 px-4 py-2 pointer-events-none break-words whitespace-pre-wrap text-left"
                style={{
                    minHeight: "40px",
                    maxHeight: "120px",
                    overflow: "hidden"
                }}
            >
                {getHighlightedText(value).map((part, index) => (
                    <span 
                        key={index} 
                        className={part.isMention ? 'bg-blue-500/20 text-blue-400 rounded px-1' : 'text-transparent'}
                    >
                        {part.text}
                    </span>
                ))}
            </div>
            <textarea
              ref={inputRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onInput={(e) => {
                e.target.style.height = "40px";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              placeholder={`${t("Message #")}${channelName}`}
              className="w-full bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none overflow-y-auto relative z-10 text-left"
              style={{
                minHeight: "40px",
                height: "40px",
                maxHeight: "120px",
                caretColor: "white", // Màu của con trỏ
                color: "transparent",
                backgroundColor: "transparent"
              }}
            />
            {showMentions && (
              <div 
                ref={mentionListRef}
                className="absolute bottom-full left-0 mb-2 bg-[#2f3136] rounded-md shadow-lg overflow-hidden"
                style={{ width: '200px' }}
              >
                {mentionUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`px-3 py-2 cursor-pointer ${
                      index === selectedMentionIndex 
                        ? 'bg-[#404249] text-white' 
                        : 'text-gray-300 hover:bg-[#36393f]'
                    }`}
                    onClick={() => insertMention(user)}
                  >
                    @{user.name}
                  </div>
                ))}
              </div>
            )}
          </div>
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
  

