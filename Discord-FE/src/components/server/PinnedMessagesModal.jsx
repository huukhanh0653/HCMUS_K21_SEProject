import React from "react";

export default function PinnedMessagesModal({ pinnedMessages, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#2b2d31] p-4 rounded shadow-lg w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Pinned Messages</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        <div
          className="max-h-60 overflow-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "grey transparent",
          }}
        >
          {pinnedMessages.map((msg) => (
            <div
              key={msg.id}
              className="mb-2 p-2 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="font-semibold">{msg.user}</div>
              <div>{msg.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
