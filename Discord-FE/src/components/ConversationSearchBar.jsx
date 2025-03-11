import React, { useState } from "react";
import "../css/SearchBar.css";
import "../css/SearchButton.css";
function SearchBar(color) {
  const [isLight, setIsLight] = useState(false);
  const toggleTheme = () => {
    setIsLight(!isLight);
  };
  return (
    <>
      {/*<form role="search" style={{ width: "100%" }}>
        <input
          className={
            "form-control ps-2 pt-1 pb-1 text-start rounded-1 " +
            (isLight ? "LightSearchBar" : "DarkSearchBar")
          }
          type="search"
          placeholder="Find or start a conversation"
          aria-label="Search"
          style={{
            backgroundColor: "#18191c",
            borderColor: "#18191c",
          }}
        />
      </form>*/}
      <button
        type="button"
        className={
          "btn rounded-1 text-start " + (isLight ? "LightButton" : "DarkButton")
        }
        style={{ width: "100%" }}
        data-bs-toggle="modal"
        data-bs-target="#searchingModal"
      >
        Find or start a conversation
      </button>
      <div
        class="modal fade"
        id="searchingModal"
        tabindex="-1"
        aria-labelledby="searchingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog justify-content-center align-items-center">
          <p className="modal-title fs-5" id="searchingModalLabel">
            Search for servers, channels or DMs
          </p>
          <div className="modal-content">
            <div className="modal-body">...</div>
            <div className="modal-footer">Protip</div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SearchBar;
