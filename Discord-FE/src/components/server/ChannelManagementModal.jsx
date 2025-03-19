import { useState } from "react";
import { X, Edit, Trash2, Plus, Check } from "lucide-react";

export default function ChannelManagementModal({ isOpen, onClose, channels, onDeleteChannel, onRenameChannel, onCreateChannel }) {
  const [editingChannelId, setEditingChannelId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#2b2d31] w-96 p-5 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">Quản lý kênh</h2>

        {/* Danh sách kênh */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {channels.map((channel) => (
            <div key={channel.id} className="flex justify-between items-center bg-[#3b3e45] p-2 rounded-lg">
              {editingChannelId === channel.id ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-[#2b2d31] text-white px-2 py-1 rounded-md flex-1 focus:outline-none"
                />
              ) : (
                <span className="text-white">{channel.name}</span>
              )}

              <div className="flex items-center gap-2">
                {editingChannelId === channel.id ? (
                  <button
                    className="p-1 bg-green-600 hover:bg-green-500 text-white rounded-md"
                    onClick={() => {
                      onRenameChannel(channel.id, editedName);
                      setEditingChannelId(null);
                      setEditedName("");
                    }}
                  >
                    <Check size={16} />
                  </button>
                ) : (
                  <button
                    className="p-1 text-gray-400 hover:text-blue-400"
                    onClick={() => {
                      setEditingChannelId(channel.id);
                      setEditedName(channel.name);
                    }}
                  >
                    <Edit size={16} />
                  </button>
                )}
                <button className="p-1 text-gray-400 hover:text-red-400" onClick={() => onDeleteChannel(channel.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tạo kênh mới */}
        {isAdding ? (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập tên kênh mới..."
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="flex-1 bg-[#3b3e45] text-white px-2 py-1 rounded-md focus:outline-none"
            />
            <button
              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-md"
              onClick={() => {
                if (newChannelName.trim()) {
                  onCreateChannel(newChannelName);
                  setNewChannelName("");
                  setIsAdding(false);
                }
              }}
            >
              Lưu
            </button>
          </div>
        ) : (
          <button
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={16} /> Tạo thêm kênh
          </button>
        )}
      </div>
    </div>
  );
}
