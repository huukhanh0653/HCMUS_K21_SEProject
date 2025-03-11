import DarkSearchAppCommand from "../assets/DarkSearchAppCommands.png"
import DarkPlus from "../assets/plus.png"
import DarkGift from "../assets/Dark Gift.png"
import DarkGif from "../assets/Dark Gif.png"
import DarkSticker from "../assets/Dark Sticker.png"
import DarkEmoji from "../assets/Dark Emoji.png"
function ChatInput(theme, channelName) {
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
        backgroundColor: "white",
        borderColor: "transparent",
        borderRadius: "50%",
        width: "15px",
        height: "15px",
    }
    return (
        <div className="d-flex mb-3 ms-3 justify-content-around">
            <div className = "d-flex flex-grow-1 rounded align-items-center ms-2 me-2"style={{backgroundColor: "#4e5159"}}>
                <button className = "d-flex justify-content-center align-items-center ms-2 me-2"style={Button}><img src = {DarkPlus} style={{height: "20px"}}/></button>
                <div className="flex-grow-1">
                <form>
                    <input style={{backgroundColor: "transparent", border: "none", width: "100%", color: "white"}}></input>
                </form>
                </div>
                <button className = "d-flex justify-content-center align-items-center ms-2 me-2"style={Button}><img src = {DarkGift} style={{height: "20px"}}/></button>
                <button className = "d-flex justify-content-center align-items-center ms-2 me-2"style={Button}><img src = {DarkGif} style={{height: "20px"}}/></button>
                <button className = "d-flex justify-content-center align-items-center ms-2 me-2"style={Button}><img src = {DarkSticker} style={{height: "20px"}}/></button>
                <button className = "d-flex justify-content-center align-items-center ms-2 me-2"style={Button}><img src = {DarkEmoji} style={{height: "20px"}}/></button>
            </div>
            <div className = "d-flex rounded align-items-center me-4 " style={{backgroundColor: "#4e5159"}}>
                <button className = "d-flex justify-content-center align-items-center ms-2 me-2"style={Button}><img src = {DarkGift} style={{height: "20px"}}/></button>
            </div>
        </div>
    )
}
export default ChatInput;