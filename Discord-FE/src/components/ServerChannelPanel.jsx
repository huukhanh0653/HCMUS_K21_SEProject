import ServerEventButton from "./ServerEventButton";
import TextChannelList from "./TextChannelList";

function ServerChannel(){
    return(
        <div className="d-flex flex-column">
            <ServerEventButton/>
            <TextChannelList/>
        </div>
    )
}
export default ServerChannel;