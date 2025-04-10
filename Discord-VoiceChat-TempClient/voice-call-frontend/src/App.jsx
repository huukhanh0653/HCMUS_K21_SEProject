import React, { useState } from "react";
import VoiceChat from "./components/VoiceChat";

function App() {
  const [userId, setUserId] = useState("");
  const [channel, setChannel] = useState("");
  const [connected, setConnected] = useState(false);

  const handleJoin = () => {
    if (userId && channel) setConnected(true);
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>React Voice Chat</h2>
      {!connected ? (
        <>
          <input
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <br />
          <input
            placeholder="Channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
          <br />
          <button onClick={handleJoin}>Join Voice Channel</button>
        </>
      ) : (
        <VoiceChat userId={userId} channel={channel} onLeave={() => setConnected(false)} />
      )}
    </div>
  );
}

export default App;
