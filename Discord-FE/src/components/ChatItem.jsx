import UserAvatarButton from "./UserAvatarButton";
import UserName from "./UserName";
function ChatItem({ theme, content }) {
  const DarkMode = {
    color: "white",
  };
  const LightMode = {
    color: "black",
  };
  return (
    <div className="d-flex">
      <div className="d-flex flex-column">
        <UserAvatarButton />
      </div>
      <div className="d-flex flex-column">
        <UserName name={"Phan Hoàng Duy"} date={"3/10/2025, 4:30 PM"} />
        {content != null ? (
          <p style={theme == "DarkMode" ? DarkMode : LightMode}>{content}</p>
        ) : null}
      </div>
    </div>
  );
}
export default ChatItem;
