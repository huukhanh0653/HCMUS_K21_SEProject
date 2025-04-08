import { useState, useRef, useEffect } from "react";
import { Plus, Gift, ImageIcon, Sticker, SmilePlus } from "lucide-react";

const SAMPLE_USERS = [
  { id: 1, name: "TanPhat", username: "tanphat" },
  { id: 2, name: "TanTai", username: "tantai" },
  { id: 3, name: "ThanhTam", username: "thanhtam" },
];

export default function MessageInput({ value, onChange, onSend, t, channelName }) {
  const editorRef = useRef(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionUsers, setMentionUsers] = useState(SAMPLE_USERS);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);

  const getTextContent = () => {
    return editorRef.current?.innerText || "";
  };

  const handleInput = () => {
    const newValue = getTextContent();
    onChange(newValue);
  
    const sel = window.getSelection();
    const lastAtSymbol = newValue.lastIndexOf("@");
  
    if (lastAtSymbol !== -1) {
      const textAfterAt = newValue.slice(lastAtSymbol + 1);
      const wordAfterAt = textAfterAt.split(" ")[0];
  
      // Nếu chuỗi @... chứa dấu cách thì không phải là mention đang gõ => ẩn
      const hasSpace = textAfterAt.includes(" ");
      if (hasSpace || !sel || !sel.anchorNode || sel.anchorNode.parentNode?.contentEditable === "false") {
        setShowMentions(false);
        return;
      }
  
      if (wordAfterAt) {
        const filtered = SAMPLE_USERS.filter((user) =>
          user.name.toLowerCase().includes(wordAfterAt.toLowerCase())
        );
        setMentionUsers(filtered);
        setShowMentions(filtered.length > 0);
        setSelectedMentionIndex(0);
      } else {
        setMentionUsers(SAMPLE_USERS);
        setShowMentions(true);
      }
    } else {
      setShowMentions(false);
    }
  };
  

  const insertMention = (user) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const containerText = getTextContent();
    const lastAt = containerText.lastIndexOf("@");
    const mentionNode = document.createElement("span");
    mentionNode.textContent = `@${user.name} `;
    mentionNode.className = "bg-blue-500/20 text-blue-400 rounded px-1";
    mentionNode.contentEditable = "false";
    
    // Clear the @... text before insert
    range.setStart(range.startContainer, lastAt);
    range.deleteContents();
    range.insertNode(mentionNode);

    // Move caret after mention
    const space = document.createTextNode(" ");
    mentionNode.after(space);
    range.setStartAfter(space);
    range.setEndAfter(space);
    sel.removeAllRanges();
    sel.addRange(range);

    setShowMentions(false);
    handleInput();
  };

  const handleKeyDown = (e) => {
    if (showMentions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((i) => (i + 1) % mentionUsers.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((i) => (i - 1 + mentionUsers.length) % mentionUsers.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(mentionUsers[selectedMentionIndex]);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.innerHTML = "";
    }
  }, [value]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#383a40] rounded-lg p-2">
      <div className="flex items-center relative">
        <button className="p-2 hover:bg-[#404249] rounded-lg">
          <Plus size={20} className="text-gray-200" />
        </button>
        <div className="relative flex-1">
          {getTextContent().trim() === "" && (
            <div className="absolute top-2 left-4 text-gray-400 pointer-events-none select-none">
              {`${t("Message #")}${channelName}`}
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[40px] max-h-[120px] overflow-y-auto px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none resize-none text-left whitespace-pre-wrap break-words"
            placeholder={`${t("Message #")}${channelName}`}
            style={{ caretColor: "white" }}
          />
          {showMentions && (
            <div
              className="absolute bottom-full left-0 mb-2 bg-[#2f3136] rounded-md shadow-lg overflow-hidden"
              style={{ width: "200px" }}
            >
              {mentionUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`px-3 py-2 cursor-pointer ${
                    index === selectedMentionIndex
                      ? "bg-[#404249] text-white"
                      : "text-gray-300 hover:bg-[#36393f]"
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