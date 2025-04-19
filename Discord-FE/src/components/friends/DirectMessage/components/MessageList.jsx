import React, { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import SampleAvt from "../../../../assets/sample_avatar.svg";
import { useTranslation } from "react-i18next";

export default function MessageList({
  messages = [],
  user,
  friend,
  editingMessageId,
  editedContent,
  setEditingMessageId,
  setEditedContent,
  handleDeleteMessage,
  handleSaveEdit,
  messagesEndRef,
}) {
  const { i18n } = useTranslation();

  // De‑duplicate and annotate timestampFallback once
  const processed = useMemo(() => {
    const seen = new Set();
    return messages
      .filter(msg => {
        const id = msg.messageId || msg.message_id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map(msg => {
        const id = msg.messageId || msg.message_id;
        // Compute a one-time fallback timestamp
        const ts = msg.timestamp ? Date.parse(msg.timestamp) : Date.now();
        return { ...msg, _msgId: id, _ts: ts };
      });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      style={{
        minHeight: '200px',
        maxHeight: 'calc(100vh - 100px)',
      }}
    >
      {processed.map((msg, idx) => {
        const senderId = msg.senderId || msg.sender_id;
        const isMine = senderId === user.id;
        const dateObj = new Date(msg._ts);

        // Format 
        const formattedDate = dateObj.toLocaleDateString(i18n.language, {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
        const formattedTime = dateObj.toLocaleTimeString(i18n.language, {
          hour: '2-digit', minute: '2-digit', hour12: false
        });

        // Grouping
        const prev = processed[idx - 1];
        const prevTs = prev ? prev._ts : msg._ts;
        const prevDateStr = new Date(prevTs).toDateString();
        const currDateStr = dateObj.toDateString();
        const showDivider = currDateStr !== prevDateStr;
        const prevSenderId = prev && (prev.senderId || prev.sender_id);
        const isGrouped = !showDivider && prevSenderId === senderId &&
          dateObj.getTime() - prevTs <= 60000;

        // Sender info
        const sender = isMine
          ? { username: 'You', avatar: user.avatar }
          : friend && senderId === friend._id
            ? { username: friend.username, avatar: friend.avatar }
            : { username: 'Unknown', avatar: SampleAvt };

        return (
          <div key={msg._msgId} className={`mb-2 ${!isGrouped ? 'pt-4' : ''}`}> 
            {showDivider && (
              <div className="flex items-center my-6">
                <div className="border-t border-gray-600 flex-1" />
                <span className="px-4 text-sm text-gray-400">{formattedDate}</span>
                <div className="border-t border-gray-600 flex-1" />
              </div>
            )}
            <div className="relative group hover:bg-[#2e3035] rounded px-2 py-1 transition-colors duration-150">
              {!isGrouped && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#36393f] overflow-hidden flex-shrink-0">
                    <img src={sender.avatar} alt={sender.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{sender.username}</span>
                      <span className="text-xs text-gray-400">{formattedTime}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className={`${isGrouped ? 'pl-14' : 'pl-14 mt-1'} relative`}>               
                {editingMessageId === msg._msgId ? (
                  <textarea
                    value={editedContent}
                    onChange={e => setEditedContent(e.target.value)}
                    className="w-full bg-[#404249] text-gray-100 p-2 mt-1 rounded-md focus:outline-none resize-none break-words whitespace-pre-wrap pr-14"
                    rows={2}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveEdit(msg._msgId);
                      }
                    }}
                  />
                ) : (
                  <p className="text-gray-100 break-words whitespace-pre-wrap text-left mt-1 pr-14">{msg.content}</p>
                )}
                {isMine && (
                  <div className="absolute top-0 right-0 hidden group-hover:flex items-center gap-2">
                    <button
                      className="p-1 text-gray-400 hover:text-gray-200"
                      onClick={() => {
                        setEditingMessageId(msg._msgId);
                        setEditedContent(msg.content);
                      }}
                    ><Edit size={16} /></button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteMessage(msg._msgId)}
                    ><Trash2 size={16} /></button>
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
