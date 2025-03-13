export default function ServerMembers() {
  const members = [
    {
      section: "ONLINE — 1",
      users: [{ name: "Gengar_B", status: "online", avatar: "/placeholder.svg?height=32&width=32" }],
    },
    {
      section: "OFFLINE — 8",
      users: [
        { name: "Cò", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Giang", status: "offline", avatar: "/placeholder.svg?height=32&width=32", role: "crown" },
        { name: "Hữu Khánh", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Nguyễn Hoàng Nhật Q...", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Nguyễn Đỗ Nguyên P...", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Nhat Quang", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "qduyisme", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Shin4ko", status: "offline", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "dnd":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="w-60 bg-[#2b2d31] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-2">
        {members.map((section) => (
          <div key={section.section} className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 px-2 mb-1">{section.section}</h3>
            {section.users.map((user) => (
              <div
                key={user.name}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#35373c] cursor-pointer"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#36393f] overflow-hidden">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${getStatusColor(user.status)}`}
                  ></div>
                </div>
                <span className="text-sm text-gray-300 truncate">{user.name}</span>
                {user.role === "crown" && <span className="text-yellow-500 text-sm">👑</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

