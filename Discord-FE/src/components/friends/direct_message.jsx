import { useState, useRef, useEffect } from "react";
import {
  Plus,
  SmilePlus,
  Gift,
  Sticker,
  ImageIcon,
  Trash2,
  Pencil,
} from "lucide-react";
import SampleAvt from "../../assets/sample_avatar.svg";

export default function DirectMessage({
  friend,
  messages: initialMessages = [],
}) {
  const [showEditTip, setShowEditTip] = useState(false);
  const [showRemoveTip, setShowRemoveTip] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update local messages when prop changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !friend) return;

    // Create a new message object
    const newMessage = {
      id: Date.now(), // Use timestamp as a simple unique ID
      sender: "You",
      content: messageInput,
      timestamp: `Today at ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    };

    // Add the new message to the messages array
    setMessages([...messages, newMessage]);

    // In a real app, you would send this to your backend
    console.log(`Sending message to ${friend.name}: ${messageInput}`);

    // Clear the input field
    setMessageInput("");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div>
            {messages.map((message) => (
              <div
                key={message.id}
                className="relative group mb-4 hover:bg-[#2e3035]"
              >
                {/* Edit Delete popup */}
                <div className="absolute top-0 right-0 m-2 w-16 h-8 bg-[#2b2d31] flex justify-around items-center text-xs rounded-md opacity-0 group-hover:opacity-100">
                  <div className="relative">
                    {showEditTip && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-10 text-white text-sm text-center py-1 rounded-md bg-black">
                        Edit
                      </div>
                    )}
                    <Pencil
                      size={20}
                      className="text-gray-200 cursor-pointer"
                      onMouseEnter={() => setShowEditTip(true)}
                      onMouseLeave={() => setShowEditTip(false)}
                      onClick={() => {}}
                    />
                  </div>
                  <div className="relative">
                    {showRemoveTip && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-14 text-[#c73539] text-sm text-center py-1 rounded-md bg-black">
                        Remove
                      </div>
                    )}
                    <Trash2
                      size={20}
                      className="text-gray-200 cursor-pointer"
                      color="#c73539"
                      onMouseEnter={() => setShowRemoveTip(true)}
                      onMouseLeave={() => setShowRemoveTip(false)}
                      onClick={() => {}}
                    />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#36393f] overflow-hidden">
                    {message.sender === "You" ? (
                      <img
                        src={SampleAvt}
                        alt="You"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={
                          friend.avatar || "/placeholder.svg?height=40&width=40"
                        }
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{message.sender}</span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-100">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#36393f] overflow-hidden mb-4">
              <img
                src={friend.avatar || "/placeholder.svg?height=64&width=64"}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">{friend.name}</h3>
            <p className="text-gray-400 max-w-md">
              This is the beginning of your direct message history with{" "}
              <span className="font-semibold">{friend.name}</span>.
            </p>
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="p-4">
        <div className="bg-[#383a40] rounded-lg">
          <div className="flex items-center p-2">
            <button className="p-2 hover:bg-[#404249] rounded-lg">
              <Plus size={20} className="text-gray-200" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={`Message @${friend.name}`}
              className="flex-1 bg-transparent border-none px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#404249] rounded-lg">
                <Gift size={20} className="text-gray-200" />
              </button>
              <button className="p-2 hover:bg-[#404249] rounded-lg">
                <ImageIcon size={20} className="text-gray-200" />
              </button>
              <button className="p-2 hover:bg-[#404249] rounded-lg">
                <Sticker size={20} className="text-gray-200" />
              </button>
              <button className="p-2 hover:bg-[#404249] rounded-lg">
                <SmilePlus size={20} className="text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
