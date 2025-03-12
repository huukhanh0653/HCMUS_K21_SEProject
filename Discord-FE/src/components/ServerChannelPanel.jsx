import ServerEventButton from "./ServerEventButton";
import TextChannelList from "./TextChannelList";

function ServerChannel() {
  return (
    <div className="flex flex-col">
      <ServerEventButton />
      <TextChannelList />
    </div>
  );
}

export default ServerChannel;
