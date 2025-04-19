import React from "react";
import { useTheme } from "../layout/ThemeProvider";
import { Plus, MessageSquare } from "lucide-react";

/**
 * ServerList component: hiển thị danh sách server của user.
 * Props:
 *  - servers: mảng server từ API.
 *  - loading: boolean đang load dữ liệu.
 *  - error: lỗi khi fetch.
 *  - selectedServer: server đang chọn.
 *  - onServerClick: hàm khi click server.
 *  - onShowCreateServer: hàm mở modal tạo server.
 */
const ServerList = ({
  servers,
  loading,
  error,
  selectedServer,
  onServerClick,
  onShowCreateServer,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`h-full w-[72px] flex flex-col items-center pt-3 gap-2 ${
        isDarkMode ? "bg-[#1e1f22]" : "bg-white border-r border-gray-200"
      }`}
    >
      {/* DM Button */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 cursor-pointer transition-all duration-200 ease-linear ${
          isDarkMode
            ? "bg-[#5865f2] hover:rounded-2xl"
            : "bg-[#1877F2] hover:rounded-2xl"
        }`}
        onClick={() => onServerClick(null)}
      >
        <MessageSquare className="text-white" size={24} />
      </div>
      <div
        className={`w-12 h-[2px] rounded-full mb-2 ${
          isDarkMode ? "bg-[#35363c]" : "bg-gray-300"
        }`}
      ></div>

      {/* Servers */}
      <div className="flex flex-col gap-2 items-center max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}
        {!loading &&
          !error &&
          servers.map((srv) => {
            const Icon = srv.server_pic
              ? () => (
                  <img
                    src={srv.server_pic}
                    alt={srv.name}
                    className="w-6 h-6 rounded-full"
                  />
                )
              : null;
            return (
              <div
                key={srv.id}
                className={`group relative w-12 h-12 rounded-full transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer ${
                  selectedServer?.id === srv.id ? "rounded-2xl" : ""
                }`}
                style={{ backgroundColor: "#2f3136" }}
                onClick={() => onServerClick(srv)}
              >
                {Icon ? (
                  <Icon />
                ) : (
                  <span className="text-white font-semibold">
                    {srv.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="absolute left-0 w-1 h-0 bg-white rounded-r-full group-hover:h-5 transition-all duration-200 -translate-x-2"></div>
                <div
                  className={`absolute left-full ml-4 px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${
                    isDarkMode
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {srv.name}
                </div>
              </div>
            );
          })}
      </div>

      <div
        className={`w-12 h-[2px] rounded-full my-2 ${
          isDarkMode ? "bg-[#35363c]" : "bg-gray-300"
        }`}
      ></div>

      {/* Add Server button */}
      <div
        className={`w-12 h-12 rounded-full transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer group mb-2 ${
          isDarkMode
            ? "bg-[#36393f] hover:bg-[#3ba55d]"
            : "bg-[#54565BFF] hover:bg-gray-300 border border-gray-300"
        }`}
        onClick={onShowCreateServer}
      >
        <Plus
          className={`transition-colors ${
            isDarkMode
              ? "text-[#3ba55d] group-hover:text-white"
              : "text-[#1877F2] group-hover:text-black"
          }`}
          size={24}
        />
      </div>
    </div>
  );
};

export default ServerList;
