import "../css/Home.css";

import ChatZone from "../components/ChatZone";
import ServerName from "../components/ServerNamePanel";
import ServerChannel from "../components/ServerChannelPanel";
function Home() {
  const secondCol = {
    backgroundColor: "#282b30",
  };
  const thirdCol = {
    backgroundColor: "#36393e",
  };

  return (
    <div className="wrapper">
      <div className="firstCol"></div>
      <div className="secondCol">
        <ServerName serverName={"Đồ án công nghệ phần mềm"}/>
        <ServerChannel/>
      </div>
      <ChatZone theme={"DarkMode"}/>
    </div>
  );
}
export default Home;
