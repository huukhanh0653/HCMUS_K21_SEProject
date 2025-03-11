import DarkHashIcon from "../assets/HashKey1.svg";
import DarkBell from "../assets/Dark Bell.png";
import DarkHelp from "../assets/Dark Help.png";
import DarkInbox from "../assets/Dark Inbox.png";
import DarkMember from "../assets/Dark Member.png"
import DarkPin from "../assets/Dark Pin.png"
import DarkThread from "../assets/Dark Thread.png"
function ChatZoneNavbar({ channelName, theme }) {
    const DarkMode = {
        color: "#f0eeeb",
        fontSize: "15px",
        fontWeight: "600"
    }
    const LightMode = {
        color: "black",
        fontSize: "15px",
        fontWeight: "600"
    }
    const Button = {
        backgroundColor: "none",
        border: "none",
        width: "15px",
        height: "15px",
    }
    return (
        <div className="d-flex border-bottom border-2 border-dark align-items-center ">
            <div className="d-flex m-3 flex-grow-1">
                <div style={DarkMode}>
                    <img src={DarkHashIcon} style={{ height: "20px" }} /> <span className="ms-1">{channelName}</span>
                </div>
            </div>
            <button className = "d-flex justify-content-center align-items-center ms-3 me-3"style={Button}><img src = {DarkThread} style={{height: "30px"}}/></button>
            <button className = "d-flex justify-content-center align-items-center ms-3 me-3"style={Button}><img src = {DarkBell} style={{height: "30px"}}/></button>
            <button className = "d-flex justify-content-center align-items-center ms-3 me-3"style={Button}><img src = {DarkPin} style={{height: "30px"}}/></button>
            <button className = "d-flex justify-content-center align-items-center ms-3 me-3"style={Button}><img src = {DarkMember} style={{height: "30px"}}/></button>
            <form>
                <input className = "rounded" placeholder="Search" style={{backgroundColor: "#1e1f22", border: "none", width: "100%", color: "white"}}></input>
            </form>
            <button className = "d-flex justify-content-center align-items-center ms-3 me-3"style={Button}><img src = {DarkInbox} style={{height: "30px"}}/></button>
            <button className = "d-flex justify-content-center align-items-center ms-1 me-3"style={Button}><img src = {DarkHelp} style={{height: "30px"}}/></button>
        </div>
    )
}
export default ChatZoneNavbar;