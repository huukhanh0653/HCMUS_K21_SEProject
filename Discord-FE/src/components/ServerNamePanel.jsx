function ServerName({ serverName }) {
    const DarkMode = {
        color: "#f0eeeb",
        fontSize: "15px",
        fontWeight: "600"
    }
    return (
        <div className="d-flex border-bottom border-2 border-dark align-items-center " style={{width: "100%"}}>
            <div className="d-flex mt-3 pb-3 flex-grow-1 justify-content-center">
                <div style={DarkMode}>
                    <span className="ms-1 text-center">{serverName}</span>
                </div>
            </div>
        </div>
    )
}
export default ServerName;