import { useState } from "react";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useTranslation } from "react-i18next";

export default function AddMemberToChannel({ isOpen, onClose, members, channel }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  // Xác định các lớp CSS dựa theo mode (light/dark)
  const modalContainerClasses = isDarkMode ? 
    "bg-[#1e1f22] text-gray-100 shadow-lg" :
    "bg-[#FFFFFF] text-[#333333] shadow-md";
    
  const inputClasses = isDarkMode ? 
    "w-full rounded p-2 mb-4 shadow-sm bg-gray-700 border border-gray-600 text-gray-100" :
    "w-full rounded p-2 mb-4 shadow-sm bg-[#F8F9FA] border border-gray-300 text-[#333333]";
    
  const cancelButtonClasses = isDarkMode ?
    "bg-[#1e1f22] text-[#1877F2] border border-[#1877F2] px-4 py-2 rounded mr-2 shadow-sm" :
    "bg-white text-[#1877F2] border border-[#1877F2] px-4 py-2 rounded mr-2 shadow-sm";
    
  const primaryButtonClasses = "bg-[#1877F2] text-white px-4 py-2 rounded shadow-sm";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Modal container */}
      <div className={`p-6 rounded z-10 w-1/3 ${modalContainerClasses}`}>
        <h2 className="text-xl font-bold mb-4">
          {t("Add Members to")} {channel?.name || t("Channel")}
        </h2>
        {/* Search Bar */}
        <input
          type="text"
          placeholder={t("Search members...")}
          className={inputClasses}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Members list */}
        <div className="max-h-64 overflow-y-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "grey transparent" }}
        >
          {filteredMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between border-b py-2">
              <div className="flex items-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{member.name}</span>
              </div>
              <input
                type="checkbox"
                checked={selectedMembers.includes(member.id)}
                onChange={() => toggleMember(member.id)}
              />
            </div>
          ))}
        </div>
        {/* Action buttons */}
        <div className="flex justify-end mt-4">
          <button
            className={cancelButtonClasses}
            onClick={onClose}
          >
            {t("Cancel")}
          </button>
          <button
            className={primaryButtonClasses}
            onClick={() => {
              console.log("Selected members for channel", channel?.id, selectedMembers);
              onClose();
            }}
          >
            {t("Add Selected")}
          </button>
        </div>
      </div>
    </div>
  );
}
