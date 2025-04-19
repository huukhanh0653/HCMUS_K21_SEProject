import React, { useState, useRef, useEffect, useCallback } from "react";
import { SmilePlus } from "lucide-react";
import UploadFile from "../../../friends/DirectMessage/components/UploadFile";
import ShowFile from "../../../friends/DirectMessage/components/ShowFile";
import StorageService from "../../../../services/StorageService";
import EmojiMenu from "../../../EmojiMenu";
import { useTheme } from "../../../layout/ThemeProvider";
import { useSelector } from "react-redux";
import { emojiGroups } from "../../../../emojiData";

export default function MessageInput({
  value,
  onChange,
  onSend,
  t,
  channelName,
}) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const { isDarkMode } = useTheme();
  const { serverMembers } = useSelector((state) => state.home);

  // — @mention state —
  const [showMentions, setShowMentions] = useState(false);
  const [mentionUsers, setMentionUsers] = useState([]);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);

  // — file upload state —
  const [showFile, setShowFile] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  // — emoji picker / suggestions state —
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [emojiSuggestions, setEmojiSuggestions] = useState([]);
  const allEmojis = Object.values(emojiGroups).flat();

  // Preserve the original input area class
  const inputAreaClass = isDarkMode
    ? "w-full min-h-[40px] max-h-[120px] overflow-y-auto px-4 py-2 text-gray-100 focus:outline-none resize-none text-left whitespace-pre-wrap break-words"
    : "w-full min-h-[40px] max-h-[120px] overflow-y-auto px-4 py-2 text-[#333333] placeholder-gray-500 focus:outline-none resize-none text-left whitespace-pre-wrap break-words shadow-sm transition-all";

  // helpers
  const getText = () => editorRef.current?.innerText || "";

  // handle input, mentions and emoji detection
  const handleInput = () => {
    const txt = getText();
    onChange(txt);
    const sel = window.getSelection();

    // @mention logic
    const atIdx = txt.lastIndexOf("@");
    if (atIdx >= 0 && sel?.anchorNode) {
      const after = txt.slice(atIdx + 1);
      const word = after.split(" ")[0];
      if (!after.includes(" ")) {
        const filtered = serverMembers.filter((u) =>
          u.username.toLowerCase().includes(word.toLowerCase())
        );
        setMentionUsers(filtered);
        setShowMentions(filtered.length > 0);
        setSelectedMentionIndex(0);
      } else setShowMentions(false);
    } else setShowMentions(false);

    // emoji suggestions
    const match = txt.match(/(:\w*)$/);
    if (match) {
      const kw = match[1].toLowerCase();
      const suggestions = allEmojis.filter((e) =>
        e.name.toLowerCase().startsWith(kw)
      );
      setEmojiSuggestions(suggestions.slice(0, 10));
    } else setEmojiSuggestions([]);
  };

  // mention insertion
  const insertMention = (user) => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    const text = getText();
    const atIdx = text.lastIndexOf("@");
    range.setStart(range.startContainer, atIdx);
    range.deleteContents();
    const node = document.createElement("span");
    node.textContent = `@${user.username}`;
    node.className = "bg-blue-200 text-blue-800 rounded px-1";
    node.contentEditable = "false";
    range.insertNode(node);
    const space = document.createTextNode(" ");
    node.after(space);
    range.setStartAfter(space);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    setShowMentions(false);
    handleInput();
  };

  // emoji insertion
  const insertEmoji = (emoji) => {
    const newMessage = getText().replace(/(:\w*)$/, emoji.unicode + " ");
    editorRef.current.innerText = newMessage;
    onChange(newMessage);
    setEmojiSuggestions([]);
    inputRef.current?.focus()
  };

  // key handling
  const handleKeyDown = (e) => {
    if (showMentions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((i) =>
          mentionUsers.length ? (i + 1) % mentionUsers.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((i) =>
          mentionUsers.length ? (i - 1 + mentionUsers.length) % mentionUsers.length : 0
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(mentionUsers[selectedMentionIndex]);
      }
      return;
    }

    if (emojiSuggestions.length > 0 && e.key === "Tab") {
      e.preventDefault();
      insertEmoji(emojiSuggestions[0]);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = getText().trim();
      if (text || uploadedUrls.length) {
        onSend({ content: text, files: uploadedUrls });
        editorRef.current.innerHTML = "";
        onChange("");
        setShowFile([]);
        setUploadedUrls([]);
      }
    }
  };

  // file upload
  const handleFileSelect = async (file) => {
    setShowFile((p) => [...p, file]);
    try {
      const { url } = await StorageService.uploadFile(file);
      setUploadedUrls((u) => [...u, url]);
    } catch {
      console.warn("Upload failed");
    }
  };

  const handleRemoveFile = (name) =>
    setShowFile((p) => p.filter((f) => f.name !== name));

  // emoji menu click
  const handleEmojiClick = (emoji) => {
    insertEmoji(emoji);
    setShowEmojiMenu(false);
  };

  const handleFullEmojiSelect = (emoji) => {
    const txt = getText();                // grab current innerText
    const newTxt = txt + emoji.unicode;   // append the unicode
    editorRef.current.innerText = newTxt; // write it back
    onChange(newTxt);                     // let Formik/Redux/etc know
    setShowEmojiMenu(false);              // close the picker
    editorRef.current?.focus();           // refocus the editor
  };

  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.innerHTML = "";
    }
  }, [value]);

  const containerCls = isDarkMode
    ? "bg-[#383a40] text-gray-100"
    : "bg-[#F8F9FA] text-[#333333] shadow-md border border-gray-200";

  return (
    <div className={`absolute bottom-0 left-0 right-0 ${containerCls} rounded-lg p-2`}>
      <ShowFile
        files={showFile}
        onRemoveFile={handleRemoveFile}
        onFileSelect={handleFileSelect}
      />

      <div className="flex items-center relative mt-2">
        <UploadFile onFileSelect={handleFileSelect} />

        <div className="relative flex-1">
          {getText().trim() === "" && (
            <div className="absolute top-2 left-4 text-gray-400 pointer-events-none select-none">
              {`${t("Message #")}${channelName}`}
            </div>
          )}

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className={inputAreaClass}
            style={{ 
              caretColor: isDarkMode ? "white" : "black",
              scrollbarWidth: "thin",
              scrollbarColor: "grey transparent",
            }}
            ></div>

          {/* @mention dropdown */}
          {showMentions && (
            <div className="absolute bottom-full left-0 mb-1 bg-gray-800 text-white rounded shadow max-h-40 overflow-auto w-48 z-10">
              {mentionUsers.map((u, i) => (
                <div
                  key={u.id}
                  className={`px-3 py-1 text-left cursor-pointer ${
                    i === selectedMentionIndex ? "bg-gray-600" : "hover:bg-gray-700"
                  }`}
                  onClick={() => insertMention(u)}
                >
                  {u.username}
                </div>
              ))}
            </div>
          )}

          {/* emoji suggestions */}
          {emojiSuggestions.length > 0 && (
            <div 
              className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-800 border rounded shadow max-h-40 overflow-auto z-20" 
              style={{ 
                width: "180px" ,
                scrollbarWidth: "thin",
                scrollbarColor: "grey transparent",
              }}
            >
              {emojiSuggestions.map((emoji, index) => (
                <button
                  key={index}
                  className="flex items-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  onClick={() => {
                    const newMessage = getText().replace(/(:\w*)$/, emoji.unicode + " ");
                    editorRef.current.innerText = newMessage;
                    onChange(newMessage);
                    setEmojiSuggestions([]);
                    inputRef.current?.focus();
                  }}
                >
                  <img src={emoji.url} alt={emoji.name} className="w-6 h-6 mr-1" />
                  <span className="text-sm">{emoji.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className={`p-2 ml-2 rounded-lg ${
            isDarkMode ? "hover:bg-[#404249]" : "bg-[#2866B7] text-white hover:bg-[#0D6EFD]"
          }`}
          onClick={(e) => { e.stopPropagation(); setShowEmojiMenu(v => !v) }}
          >
          <SmilePlus size={20} />
        </button>

        {/* full emoji picker positioned below the button */}
        {showEmojiMenu && (
          <div className="absolute bottom-14 right-2 z-50">
            <EmojiMenu
              onSelect={handleFullEmojiSelect}        // ← use the new one
              onClose={() => setShowEmojiMenu(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
