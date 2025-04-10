import React from "react";
import { useTheme } from "../layout/ThemeProvider";
import {
    Plus,
    Mic,
    Headphones,
    Settings,
    MessageSquare,
    Users,
    Gamepad2,
    TreePine,
    Bell as BellIcon,
    Ghost,
    Sword,
    Crown,
    Rocket,
    Hash,
    Volume2,
    UserPlus,
  } from "lucide-react";

const servers = [
    { icon: TreePine, color: "#3ba55c", label: "Nature Gaming" },
    { icon: Gamepad2, color: "#5865f2", label: "Gaming Hub" },
    { icon: BellIcon, color: "#faa61a", label: "Sports Club" },
    { icon: Ghost, color: "#ed4245", label: "Ghost Gaming" },
    { icon: Sword, color: "#9b59b6", label: "RPG Community" },
    { icon: Crown, color: "#f1c40f", label: "Royal Gaming" },
    { icon: Rocket, color: "#e91e63", label: "Space Station" },
  ];

const ServerList = ({ selectedServer, onServerClick, onShowCreateServer }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div
      className={`h-full w-[72px] flex flex-col items-center pt-3 gap-2 ${
        isDarkMode ? "bg-[#1e1f22]" : "bg-white border-r border-gray-200"
      }`}
    >
      {/* Discord DM Button */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 cursor-pointer transition-all duration-200 ease-linear ${
          isDarkMode ? "bg-[#5865f2] hover:rounded-2xl" : "bg-[#1877F2] hover:rounded-2xl"
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

      {/* Server icons */}
      <div className="flex flex-col gap-2 items-center max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
        {servers.map((server, index) => {
          const Icon = server.icon;
          return (
            <div
              key={index}
              className={`group relative w-12 h-12 rounded-full transition-all duration-200 ease-linear flex items-center justify-center cursor-pointer ${
                selectedServer?.label === server.label ? "rounded-2xl" : ""
              }`}
              style={{ backgroundColor: server.color }}
              onClick={() => onServerClick(server)}
            >
              <Icon className="text-white" size={24} />
              <div className="absolute left-0 w-1 h-0 bg-white rounded-r-full group-hover:h-5 transition-all duration-200 -translate-x-2"></div>
              <div
                className={`absolute left-full ml-4 px-3 py-2 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${
                  isDarkMode ? "bg-black text-white" : "bg-gray-100 text-black"
                }`}
              >
                {server.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`w-12 h-[2px] rounded-full my-2 ${isDarkMode ? "bg-[#35363c]" : "bg-gray-300"}`}></div>
      
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
