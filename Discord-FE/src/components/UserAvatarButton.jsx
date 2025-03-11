import DisordIcon from "../assets/discord-mark-black.png";
import "../css/UserAvatarButton.css";

function UserAvatarButton() {
  return (
    <div>
      <a className="btn btn-circle d-flex justify-content-center align-items-center">
        <img src={DisordIcon} style={{ height: "30px" }}></img>
      </a>
    </div>
  );
}
export default UserAvatarButton;
