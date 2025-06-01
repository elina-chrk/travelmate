import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./ChatBox.css";

function ChatBox({ tripId, userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [tripId]);

  const loadMessages = async () => {
    try {
      const res = await axiosInstance.get(`/messages/${tripId}`, {
        params: { page: 1, pageSize: 50 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.items ?? []);
    } catch (err) {
      console.error("Не вдалося завантажити повідомлення", err.response?.data || err.message);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axiosInstance.post(`/messages`, {
        travelGroupId: tripId,
        text: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage("");
      loadMessages();
    } catch (err) {
      console.error("Не вдалося надіслати повідомлення", err.response?.data || err.message);
    }
  };

  // Формат часу
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Формат дати (заголовок)
  const formatDateHeader = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let lastDate = null;

  return (
    <div className="chat-box">
      <h3 className="chat-title">💬 Чат подорожі</h3>
      <div className="chat-messages">
        {messages.map((msg) => {
          const currentDate = new Date(msg.sentAt).toDateString();
          let showDateHeader = false;

          if (lastDate !== currentDate) {
            showDateHeader = true;
            lastDate = currentDate;
          }

          return (
            <div key={msg.id}>
              {showDateHeader && (
                <div className="chat-date-header">
                  {formatDateHeader(msg.sentAt)}
                </div>
              )}
              <div
                className={`chat-message ${
                  msg.participation?.userId === userId ? "own-message" : ""
                }`}
              >
                <div className="chat-header">
                  <span className="chat-username">{msg.username ?? "?"}</span>
                  <span className="chat-time">{formatTime(msg.sentAt)}</span>
                </div>
                <div className="chat-text">{msg.text}</div>
              </div>
            </div>
          );
        })}
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Напишіть повідомлення..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Надіслати</button>
      </form>
    </div>
  );
}

export default ChatBox;
