import ChatZone from "../components/ChatZone";
import ServerName from "../components/ServerNamePanel";
import ServerChannel from "../components/ServerChannelPanel";

function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (First Column) */}
      <div className="bg-[#1e2124] w-[5%]"></div>

      {/* Server Info & Channels (Second Column) */}
      <div className="bg-[#282b30] w-[18%] flex flex-col flex-wrap p-0">
        <ServerName serverName={"Đồ án công nghệ phần mềm"} />
        <ServerChannel />
      </div>

      {/* Chat Zone (Third Column) */}
      <div className="w-[77%]">
        <ChatZone theme={"DarkMode"} />
      </div>
    </div>
  );
}

export default Home;
