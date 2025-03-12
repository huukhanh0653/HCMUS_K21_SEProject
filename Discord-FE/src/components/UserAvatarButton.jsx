import DisordIcon from "../assets/discord-mark-black.png";

function UserAvatarButton() {
  return (
    <div>
      <a className="flex justify-center items-center w-[60px] h-[60px] rounded-full">
        <img src={DisordIcon} className="h-[30px]" alt="User Avatar" />
      </a>
    </div>
  );
}

export default UserAvatarButton;
