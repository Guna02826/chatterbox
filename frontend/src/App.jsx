import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessageReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleMessageReceive);

    return () => {
      socket.off("receiveMessage", handleMessageReceive);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { username, message });
      setMessage("");
    }
  };

  const setUser = () => {
    if (username.trim()) {
      socket.emit("setUsername", username);
      setIsUsernameSet(true);
    }
  };

  return (
    <div className="bg-blue-50 text-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-5xl font-bold text-blue-700">Real-Time Chat App</h1>

        {!isUsernameSet ? (
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              className="w-full border border-blue-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg shadow-sm transition"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setUser()}
            />
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
              onClick={setUser}
              disabled={!username.trim()}
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <>
            <div
              className="messages-container bg-white rounded-lg shadow p-5 max-h-96 overflow-y-auto text-left space-y-3"
              aria-live="polite"
            >
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className="bg-blue-100 text-sm p-3 rounded-lg w-fit max-w-xs"
                >
                  <strong className="text-blue-700">{msg.username}:</strong>{" "}
                  {msg.message}
                </p>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={message}
                className="flex-1 border border-blue-300 focus:ring-2 focus:ring-blue-500 p-3 rounded-lg shadow-sm transition"
                placeholder="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
                onClick={sendMessage}
                disabled={!message.trim()}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
