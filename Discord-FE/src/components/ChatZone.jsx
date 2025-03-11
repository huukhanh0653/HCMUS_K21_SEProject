import ChatInput from "./ChatInput";
import ChatItem from "./ChatItem";
import ChatWelcome from "./ChatWelcome";
import ChatZoneNavbar from "./ChatZoneNavbar";

function ChatZone({ theme }) {
  const DarkMode = {
    backgroundColor: "#36393e",
    width: "77%",
  };
  const LightMode = {
    backgroundColor: "white",
    width: "77%",
  };
  const ScrollingZone = {
    flex: "1",
    overflowY: "scroll", 
    scrollbarColor: "#1a1b1e #2b2d31",
  }
  const ScrollingContainer = {
    maxHeight: "0"
  }
  return (
    <div
      className="d-flex flex-column"
      style={theme == "DarkMode" ? DarkMode : LightMode}
    >
      <ChatZoneNavbar channelName={"general"} theme = {theme}/>
      <section style = {ScrollingZone}>
        <div style={ScrollingContainer}>
          <ChatWelcome channelName={"general"} theme={theme} />
          <ul style = {{listStyleType: "none"}}>
            <li><ChatItem theme = "DarkMode" content={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"} image = {"https://orchardfruit.com/cdn/shop/files/Navel-Oranges-1-Pcs-The-Orchard-Fruit-72137770.jpg?crop=center&height=1200&v=1722937866&width=1200"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
            <li><ChatItem theme = "DarkMode" content={"Hello hello"}/></li>
          </ul>
        </div>
      </section>
      <ChatInput theme = "DarkMode" channelName = {"general"}/>
    </div>
  );
}
export default ChatZone;
