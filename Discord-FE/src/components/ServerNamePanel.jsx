function ServerName({ serverName }) {
    return (
      <div className="flex items-center border-b-2 border-black w-full">
        <div className="flex mt-3 pb-3 flex-grow justify-center">
          <div className="text-[#f0eeeb] text-sm font-semibold">
            <span className="ml-1 text-center">{serverName}</span>
          </div>
        </div>
      </div>
    );
  }
  
  export default ServerName;
  