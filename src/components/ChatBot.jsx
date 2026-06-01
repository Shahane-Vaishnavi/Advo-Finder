import { useState } from "react";

function ChatBot() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      }
    );

    const data = await response.json();
    setReply(data.reply);
  };

  return (
    <div>
      <h2>LigalSakhi AI</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask your legal question..."
      />

      <button onClick={sendMessage}>
        Send
      </button>

      <div>
        <p>{reply}</p>
      </div>
    </div>
  );
}

export default ChatBot;