import ChatItem from "./ChatItem";
import ChatWelcome from "./ChatWelcome";

function ChatZone({ theme }) {
  const DarkMode = {
    backgroundColor: "#36393e",
    width: "77%",
  };
  const LightMode = {
    backgroundColor: "white",
    width: "77%",
  };
  return (
    <div
      className="d-flex flex-column"
      style={theme == "DarkMode" ? DarkMode : LightMode}
    >
      <ChatWelcome channelName={"general"} theme={theme} />
      <div className="flex-grow-1">
        <ChatItem theme="DarkMode" content={"I will display &#8986;"} />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
      </div>
      <div className="mt-auto">blank blank</div>
    </div>
  );
}
export default ChatZone;
