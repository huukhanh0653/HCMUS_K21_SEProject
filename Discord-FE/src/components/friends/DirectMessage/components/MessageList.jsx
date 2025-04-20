import React, { useMemo } from "react";
import { Edit, Trash2, File, PlayCircle, Eye, Download } from "lucide-react";
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
  loadOlder,
  hasMore,
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

  // GỌi thêm tin nhắn khi kéo scrollbar lên trên
  const handleScroll = e => {
    // when scroll hits (or nears) the top, fetch older
    if (e.target.scrollTop <= 0 && hasMore) {
      loadOlder();
    }
  };

  return (
    <div
      onScroll={handleScroll}
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

                {/* Attachments preview with view/download at top-right */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.attachments.map((url, i) => {
                      const filename = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
                      const ext = filename.split('.').pop().toLowerCase();
                      const isImage = ['jpg','jpeg','png','gif','svg'].includes(ext);
                      const isVideo = ['mp4','webm','ogg','mov'].includes(ext);

                      return (
                        <div key={i} className="relative w-24 h-24 bg-[#404249] rounded-lg overflow-hidden">
                          {isImage && (
                            <img src={url} alt={filename} className="w-full h-full object-cover" />
                          )}
                          {isVideo && (
                            <video src={url} controls className="w-full h-full object-cover" />
                          )}
                          {!isImage && !isVideo && (
                            <div className="flex flex-col items-center justify-center w-full h-full text-gray-200 p-2">
                              <File size={24} />
                              <span className="mt-1 text-xs truncate">{filename}</span>
                            </div>
                          )}

                          {/* View/Download buttons at top-right */}
                          <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => window.open(url, '_blank')} className="p-1 bg-black bg-opacity-50 rounded">
                              <Eye size={16} className="text-white" />
                            </button>
                            <a href={url} download={filename} className="p-1 bg-black bg-opacity-50 rounded">
                              <Download size={16} className="text-white" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
