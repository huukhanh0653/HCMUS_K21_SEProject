import DarkHashIcon from "../assets/HashKey1.svg";

function ChatWelcome({ channelName, theme }) {
  const DarkMode = "text-[#f0eeeb] text-2xl font-bold";
  const LightMode = "text-black text-2xl font-bold";
  const HashStyle = "bg-[#41434a] h-15 w-15 rounded-full flex justify-center items-center";

  return (
    <div>
      <div className={`${HashStyle} ml-3 mt-2`}>
        <img src={DarkHashIcon} className="h-[30px]" />
      </div>
      <p className={`ml-3 mb-1 ${theme === "DarkMode" ? DarkMode : LightMode}`}>
        Welcome to #{channelName}!
      </p>
      <p className={`ml-3 ${theme === "DarkMode" ? "text-gray-400" : "text-black"}`}>
        This is the start of the #{channelName} channel.
      </p>
    </div>
  );
}

export default ChatWelcome;
