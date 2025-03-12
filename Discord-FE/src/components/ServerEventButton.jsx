import DarkEvent from "../assets/Dark Event.png";

function ServerEventButton() {
  return (
    <div className="flex items-center mt-3 mx-3 pb-3 border-b border-gray-300 border-opacity-10">
      <button className="flex justify-center items-center mx-3 bg-transparent border-none w-[15px] h-[15px]">
        <img src={DarkEvent} className="h-[30px]" />
      </button>
      <a href="/" className="text-gray-500 no-underline">
        Events
      </a>
    </div>
  );
}

export default ServerEventButton;
