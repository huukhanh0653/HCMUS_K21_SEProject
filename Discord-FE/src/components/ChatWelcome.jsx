import DarkHashIcon from "../assets/HashKey1.svg";
function ChatWelcome({ channelName, theme }) {
  const DarkMode = {
    color: "#f0eeeb",
    fontSize: "30px",
    fontWeight: "700"
  }
  const LightMode = {
    color: "black",
    fontSize: "30px",
    fontWeight: "700"
  }
  const HashStyle = {
    backgroundColor: "#41434a",
    height: "60px",
    width: "60px",
    borderRadius: "50%"
  }
  return (
    <div>
      <div className="d-flex justify-content-center align-items-center ms-3 mt-2" style={HashStyle}>
        <img src={DarkHashIcon} style={{ height: "30px" }} />
      </div>
      <p className="ms-3 mb-1" style={
        theme == "DarkMode" ? DarkMode : LightMode}>
        Welcome to #{channelName}!
      </p>
      <p className="ms-3" style={
        theme == "DarkMode" ? {color: "#bdbdbd"} : {color: "black"}
      }>
        This is the start of the #{channelName} channel.
      </p>
    </div>
  );
}
export default ChatWelcome;
