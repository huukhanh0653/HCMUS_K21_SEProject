import { useState } from "react";
import DarkInvite from "../assets/DarkInvite.png";

function TextChannelList() {
  const channels = ["chung", "phân-công", "trợ-giúp-làm-bài-tập-về-nhà", "lạc-đề", "họp"];
  const [selectedChannel, setSelectedChannel] = useState(-1);

  return (
    <div className="flex flex-col m-3">
      <a href="#" className="text-xs font-extrabold text-gray-500 no-underline">
        KÊNH CHAT
      </a>
      <ul className="list-none">
        {channels.map((channel, index) => (
          <li key={index} className="mt-1 mb-1">
            <button
              type="button"
              className={`w-full text-left px-2 py-1 rounded ${
                selectedChannel === index
                  ? "bg-[#404249] text-white"
                  : "bg-transparent text-gray-500"
              }`}
              onClick={() => setSelectedChannel(index)}
            >
              # {channel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TextChannelList;
