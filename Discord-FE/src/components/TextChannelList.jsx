import { useState } from "react";
import DarkInvite from "../assets/DarkInvite.png"
function TextChannelList() {
    let channels = ["chung", "phân-công", "trợ-giúp-làm-bài-tập-về-nhà", "lạc-đề", "họp"]
    const TextStyle = {
        fontSize: "12px",
        fontWeight: "750",
        color: "#868c94",
        textDecoration: "none"
    }
    const Button = {
        border: "none",
        backgroundColor: "transparent",
        color: "#868c94"
    }
    const SelectedButton = {
        border: "none",
        backgroundColor: "#404249",
        color: "white"
    }
    const [selectedChannel, setSelectedChannel] = useState(-1);
    return (
        <div className="d-flex flex-column m-3">
            <a href="" style={TextStyle}>KÊNH CHAT</a>
            <ul className="list-group" style={{ listStyleType: "none" }}>
                {channels.map((channel, index) =>
                    <li className="mt-1 mb-1">
                        <button type="button" style={
                            selectedChannel === index ? SelectedButton : Button
                        }
                            onClick={() => { setSelectedChannel(index) }}>
                            # {channel} 
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}
export default TextChannelList;