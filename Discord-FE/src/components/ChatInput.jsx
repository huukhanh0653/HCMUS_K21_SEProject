import ImageButton from "./ui/imageButton";
function ChatInput({ theme, channelName }) {
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
        backgroundColor: "white",
        borderColor: "transparent",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
    };

    return (
        <div className="flex mb-3 ml-3 justify-around">
            <div className="flex-grow rounded flex items-center mx-2" style={{ backgroundColor: "#4e5159" }}>
                <ImageButton  src = "/asset/add.png"/>
                <div className="flex-grow">
                    <form>
                        <input className="bg-transparent border-none w-full text-white" placeholder="Type a message..." />
                    </form>
                </div>
                <ImageButton  src = "/asset/Dark Gift.png"/>
                <ImageButton  src = "/asset/Dark Gif.png"/>
                <ImageButton  src = "/asset/Dark Sticker.png"/>
                <ImageButton  src = "/asset/Dark Emoji.png"/>
            </div>
            <div className="flex rounded items-center mr-4" style={{ backgroundColor: "#4e5159" }}>
                <ImageButton src = "/asset/DarkSearchAppCommands.png"/>
            </div>
        </div>
    );
}

export default ChatInput;
