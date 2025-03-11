import "../css/Home.css";
import "../css/ServerNavbar.css";
import SearchBar from "../components/ConversationSearchBar";
import ChatZone from "../components/ChatZone";
function Home() {
  const secondCol = {
    backgroundColor: "#282b30",
  };
  const thirdCol = {
    backgroundColor: "#36393e",
  };

  return (
    <div className="wrapper">
      <div className="firstCol">aaaa</div>
      <div className="secondCol"></div>
      <ChatZone theme={"DarkMode"}></ChatZone>
    </div>
  );
}
export default Home;
