import ChatInput from "./ChatInput";
import ChatItem from "./ChatItem";
import ChatWelcome from "./ChatWelcome";
import ChatZoneNavbar from "./ChatZoneNavbar";

function ChatZone({ theme }) {
  return (
    <div className={`flex flex-col w-[77%] ${theme === "DarkMode" ? "bg-[#36393e]" : "bg-white"}`}>
      {/* Navbar */}
      <ChatZoneNavbar channelName={"general"} theme={theme} />

      {/* Scrollable Chat Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        <div>
          <ChatWelcome channelName={"general"} theme={theme} />
          <ul className="list-none space-y-2">
            {Array(15)
              .fill("Hello hello")
              .map((content, index) => (
                <li key={index}>
                  <ChatItem theme={theme} content={content} />
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* Chat Input */}
      <ChatInput theme={theme} channelName={"general"} />
    </div>
  );
}

export default ChatZone;
