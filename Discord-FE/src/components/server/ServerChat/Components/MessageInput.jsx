import { useState, useRef, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import UploadFile from "../../../friends/DirectMessage/components/UploadFile";
import ShowFile from "../../../friends/DirectMessage/components/ShowFile";
import StorageService from "../../../../services/StorageService";
import EmojiMenu from "../../../EmojiMenu";
import { useTheme } from "../../../layout/ThemeProvider";

const SAMPLE_USERS = [
  { id: 1, name: "TanPhat", username: "tanphat" },
  { id: 2, name: "TanTai", username: "tantai" },
  { id: 3, name: "ThanhTam", username: "thanhtam" },
];

export default function MessageInput({
  value,
  onChange,
  onSend,
  t,
  channelName,
}) {
  const editorRef = useRef(null);
  const { isDarkMode } = useTheme();
  const [showMentions, setShowMentions] = useState(false);
  const [mentionUsers, setMentionUsers] = useState(SAMPLE_USERS);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [showFile, setShowFile] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  // State để điều khiển hiển thị menu emoji
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);

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
    mentionNode.textContent = `@${user.name}`;
    mentionNode.className = "bg-blue-500/20 text-blue-400 rounded px-1";
    mentionNode.contentEditable = "false";

    range.setStart(range.startContainer, lastAt);
    range.deleteContents();
    range.insertNode(mentionNode);

    const space = document.createTextNode(" ");
    mentionNode.after(space);
    range.setStartAfter(space);
    range.setEndAfter(space);
    sel.removeAllRanges();
    sel.addRange(range);

    setShowMentions(false);
    handleInput();
  };

  const handleFileSelect = async (file) => {
    setShowFile((prev) => [...prev, file]);
    try {
      const result = await StorageService.uploadFile(file);
      if (result?.url) {
        setUploadedUrls((prev) => [...prev, result.url]);
      } else {
        console.warn("No URL returned after upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleRemoveFile = (fileName) => {
    setShowFile((prev) => prev.filter((file) => file.name !== fileName));
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
      const fullMessage = prepareMessage();
      if (fullMessage) {
        onSend(fullMessage);
        editorRef.current.innerHTML = "";
        onChange("");
        setShowFile([]);
        setUploadedUrls([]);
      }
    }
  };

  const prepareMessage = () => {
    const messageText = getTextContent().trim();
    if (messageText === "" && uploadedUrls.length === 0) return null;
    return {
      sender: { id: 1 },
      content: messageText,
      file: uploadedUrls,
    };
  };

  const handleSendClick = () => {
    const fullMessage = prepareMessage();
    if (fullMessage) {
      onSend(fullMessage);
      editorRef.current.innerHTML = "";
      onChange("");
      setShowFile([]);
      setUploadedUrls([]);
    }
  };

  // Hàm chèn emoji vào nội dung soạn
  const handleEmojiSelect = (emoji) => {
    // Append emoji unicode to the existing message content (value)
    const newMessage = value + emoji.unicode;
    console.log(newMessage);  
    onChange(newMessage);
    setShowEmojiMenu(false);
    // Refocus the contentEditable div using editorRef
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.innerHTML = "";
    }
  }, [value]);

  // Các biến class CSS theo UI (Dark/Light)
  const containerClass = isDarkMode
    ? "bg-[#383a40] text-gray-100"
    : "bg-[#F8F9FA] text-[#333333] shadow-md border border-gray-200";
    
  const inputAreaClass = isDarkMode
    ? "w-full min-h-[40px] max-h-[120px] overflow-y-auto px-4 py-2 text-gray-100 focus:outline-none resize-none text-left whitespace-pre-wrap break-words"
    : "w-full min-h-[40px] max-h-[120px] overflow-y-auto px-4 py-2 text-[#333333] placeholder-gray-500 focus:outline-none resize-none text-left whitespace-pre-wrap break-words shadow-sm transition-all";

  const EmojiButtonClass = isDarkMode
    ? "p-2 hover:bg-[#404249] rounded-lg"
    : "p-2 bg-[#2866B7FF] text-white rounded-lg shadow-sm hover:bg-[#1960CAFF] transition duration-200";

  return (
    <div className={`absolute bottom-0 left-0 right-0 ${containerClass} border border-gray-400 rounded-lg p-2`}>
      <div className="flex flex-col">
        <ShowFile
          files={showFile}
          onRemoveFile={handleRemoveFile}
          onFileSelect={handleFileSelect}
        />

        <div className="flex items-center relative mt-2">
          <UploadFile onFileSelect={handleFileSelect} />

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
              className={inputAreaClass}
              style={{ caretColor: isDarkMode ? "white" : "black" }}
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

          <button className={EmojiButtonClass} onClick={handleSendClick}>
            {/* Nút này để mở menu emoji */}
            <SmilePlus
              size={20}
              className="text-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiMenu((prev) => !prev);
              }}
            />
          </button>

          {/* Hiển thị menu emoji khi chọn */}
          {showEmojiMenu && (
            <EmojiMenu onSelect={handleEmojiSelect} onClose={() => setShowEmojiMenu(false)} />
          )}      

        </div>
      </div>
    </div>
  );
}
