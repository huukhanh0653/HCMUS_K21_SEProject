import DarkEvent from "../assets/Dark Event.png"
function ServerEventButton()
{
    const Button = {
        backgroundColor: "none",
        border: "none",
        width: "15px",
        height: "15px",
    }
    return(
    <div className="d-flex align-items-center mt-3 me-3 ms-3 pb-3 border-bottom  border-1 border-dark-subtle border-opacity-10">
        <button className = "d-flex justify-content-center align-items-center ms-3 me-3"style={Button}>
            <img src = {DarkEvent} style={{height: "30px"}}/>
        </button>
        <a href = "/" style={{color: "#868c94", textDecoration: "none"}}>Events</a>
    </div>
    )
}   
export default ServerEventButton;