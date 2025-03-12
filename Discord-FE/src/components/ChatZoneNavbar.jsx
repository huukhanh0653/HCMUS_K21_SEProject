import DarkHashIcon from "../assets/HashKey1.svg";
import DarkBell from "../assets/Dark Bell.png";
import DarkHelp from "../assets/Dark Help.png";
import DarkInbox from "../assets/Dark Inbox.png";
import DarkMember from "../assets/Dark Member.png";
import DarkPin from "../assets/Dark Pin.png";
import DarkThread from "../assets/Dark Thread.png";
import ImageButton from "./ui/imageButton";

function ChatZoneNavbar({ channelName, theme }) {
    const DarkMode = {
        color: "#f0eeeb",
        fontSize: "15px",
        fontWeight: "600"
    };
    const LightMode = {
        color: "black",
        fontSize: "15px",
        fontWeight: "600"
    };
    const Button = {
        backgroundColor: "none",
        border: "none",
        width: "15px",
        height: "15px",
    };

    return (
        <div className="flex border-b-2 border-dark items-center">
            <div className="flex m-3 flex-grow">
                <div style={DarkMode}>
                    <img src={DarkHashIcon} style={{ height: "20px" }} /> <span className="ml-1">{channelName}</span>
                </div>
            </div>
            <ImageButton src = "/asset/Dark Thread.png"/>
            <ImageButton src = "/asset/Dark Bell.png"/>
            <ImageButton src = "/asset/Dark Pin.png"/>
            <ImageButton src = "/asset/Dark Member.png"/>
            <form>
                <input className="rounded bg-gray-900 text-white w-full" placeholder="Search" style={{ border: "none" }} />
            </form>
            <ImageButton src = "/asset/Dark Inbox.png"/>
            <ImageButton src = "/asset/Dark Help.png"/>
        </div>
    );
}

export default ChatZoneNavbar;
