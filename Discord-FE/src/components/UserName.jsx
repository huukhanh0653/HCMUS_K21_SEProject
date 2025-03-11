function UserName({ name, date }) {
  const LightStyle = {
    color: "black",
    textDecoration: "none",
    fontWeight: "500",
  };
  const DarkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  };
  const DateLightStyle = {
    color: "black",
    fontSize: "14px",
  };
  const DateDarkStyle = {
    color: "#a8a8a8",
    fontSize: "14px",
  };
  return (
    <div className="d-flex">
      <div className="me-2">
        <a href="/" style={DarkStyle}>
          {name}
        </a>
      </div>
      <div
        className=""
        style={DateDarkStyle}
        onMouseEnter={{}}
      >
        {date}
      </div>
    </div>
  );
}
export default UserName;
