import UserAvatarButton from "./UserAvatarButton";
import UserName from "./UserName";
function ChatItem({ theme, content, image }) {
  const DarkMode = {
    color: "white",
  };
  const LightMode = {
    color: "black",
  };
  const ImageStyle = {
    height: "100px",
    width: "100px"
  }
  return (
    <div className="d-flex">
      <div className="d-flex flex-column">
        <UserAvatarButton />
      </div>
      <div className="d-flex flex-column">
        <UserName name={"Phan Hoàng Duy"} date={"3/10/2025, 4:30 PM"} />
        {image != null ? (
          <img src ={image} alt = "placeholder" style={ImageStyle}/>
        ) : null}
        {content != null ? (
          <p style={theme == "DarkMode" ? DarkMode : LightMode}>{content}</p>
        ) : null}
      </div>
    </div>
  );
}
export default ChatItem;
