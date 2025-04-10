import React, { useState, useMemo } from "react";

// Hàm giúp định dạng nội dung: chuyển các phần có dấu @ thành text màu xanh
function formatContent(content) {
  const regex = /(@\w+)/g;
  const parts = content.split(regex);
  return parts.map((part, i) => {
    if (regex.test(part)) {
      return <span key={i} className="text-blue-500">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function NotificationModal({ onClose }) {
  // Mảng thông báo mẫu với biến time (ngày giờ hiển thị gọn ở góc phải)
  const sampleNotifications = [
    { id: 1, icon: "https://i.pravatar.cc/50?img=38", header: "John Doe", content: "Liked your post.", time: "Mar 22, 08:10" },
    { id: 2, icon: "https://i.pravatar.cc/50?img=39", header: "John Doe", content: "Commented: Nice work!", time: "Mar 22, 08:12" },
    { id: 3, icon: "https://i.pravatar.cc/50?img=31", header: "Tech Server - General", content: "@JohnDoe đã nhắc đến bạn", time: "Mar 22, 09:00" },
    { id: 4, icon: "https://i.pravatar.cc/50?img=33", header: "Gaming Server - Voice", content: "@JaneDoe đã nhắc đến bạn", time: "Mar 22, 09:05" },
    { id: 5, icon: "https://i.pravatar.cc/50?img=23", header: "Admin", content: "Welcome to the community!", time: "Mar 22, 09:10" },
    { id: 6, icon: "https://i.pravatar.cc/50?img=45", header: "Tech Server - General", content: "@Mike đã nhắc đến bạn", time: "Mar 22, 09:15" },
    { id: 7, icon: "https://i.pravatar.cc/50?img=12", header: "Jane Smith", content: "Sent you a friend request.", time: "Mar 22, 09:20" },
    { id: 8, icon: "https://i.pravatar.cc/50?img=42", header: "Gaming Server - Voice", content: "@Anna đã nhắc đến bạn", time: "Mar 22, 09:25" },
    { id: 9, icon: "https://i.pravatar.cc/50?img=90", header: "Jane Smith", content: "Accepted your friend request.", time: "Mar 22, 09:30" },
    { id: 10, icon: "https://i.pravatar.cc/50?img=35", header: "System", content: "Maintenance scheduled.", time: "Mar 22, 09:35" }
  ];

  // Gom nhóm thông báo theo header
  const groupedNotifications = useMemo(() => {
    return sampleNotifications.reduce((acc, notif) => {
      if (!acc[notif.header]) {
        acc[notif.header] = [];
      }
      acc[notif.header].push(notif);
      return acc;
    }, {});
  }, [sampleNotifications]);

  // State kiểm soát trạng thái mở/đóng của từng nhóm (dùng key là header)
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (header) => {
    setOpenGroups((prev) => ({ ...prev, [header]: !prev[header] }));
  };

  return (
    <div 
      className="fixed top-16 right-4 bg-white dark:bg-[#2b2d31] shadow-lg rounded-md p-4 w-96 z-50"
      onClick={(e) => e.stopPropagation()}  // Ngăn click bên trong bắn ra overlay
    >
      <div className="flex items-center mb-4">
        <h2 className="font-semibold text-lg text-left">Notifications</h2>
      </div>
      <div 
        className="max-h-80 overflow-y-auto" 
        style={{ scrollbarWidth: "thin", scrollbarColor: "grey transparent" }}
      >
        {Object.keys(groupedNotifications).map((header) => {
          const notifications = groupedNotifications[header];
          
          // Nếu header chứa " - ", giả sử đó là thông báo từ Server - Channel
          let displayHeader;
          if (header.includes(" - ")) {
            const parts = header.split(" - ");
            displayHeader = (
              <span className="font-medium text-left">
                <strong>{parts[0]}</strong> -- #{parts[1]}
              </span>
            );
          } else {
            displayHeader = (
              <span className="font-medium text-left">{header}</span>
            );
          }
          
          return (
            <div key={header} className="border rounded-md p-2 mb-2">
              <div className="flex items-center cursor-pointer" onClick={() => toggleGroup(header)}>
                {notifications.length > 1 && (
                  <button className="mr-2 text-sm">
                    {openGroups[header] ? "-" : "+"}
                  </button>
                )}
                <div className="flex items-center space-x-2">
                  <img
                    src={notifications[0].icon}
                    alt="Notification Icon"
                    className="w-6 h-6 rounded-full"
                  />
                  {displayHeader}
                </div>
              </div>
              {(openGroups[header] || notifications.length === 1) && (
                <div className="mt-2 space-y-1 pl-8 text-left">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="text-sm flex justify-between items-center">
                      <div>
                        {header.includes(" - ") 
                          ? formatContent(notif.content) 
                          : notif.content
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {notif.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
