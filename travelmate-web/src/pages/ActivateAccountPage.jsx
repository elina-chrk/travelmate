import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./ActivateAccountPage.css";

function ActivateAccountPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Токен не вказано.");
      return;
    }

    axiosInstance
      .get(`/Account/activate?token=${token}`)
      .then(() => {
        setStatus("success");
        setMessage("✅ Акаунт успішно активовано! Зараз вас буде перенаправлено...");
        setTimeout(() => navigate("/login"), 4000);
      })
      .catch((err) => {
        console.error("❌ Помилка активації:", err);
        setStatus("error");
        setMessage("❌ Не вдалося активувати акаунт. Можливо, токен недійсний або прострочений.");
      });
  }, [searchParams, navigate]);

  return (
    <div className="activate-container">
      <div className="activate-box">
        <h1 className="activate-title">Активація акаунта</h1>
        <p className={`activate-message ${status}`}>{message}</p>
        {status === "loading" && <p>⏳ Перевіряємо токен...</p>}
        {status === "success" && <p className="redirect-text">🔐 Перенаправлення на вхід...</p>}
        {status === "error" && (
          <button onClick={() => navigate("/login")} className="activate-button">
            👉 На сторінку входу
          </button>
        )}
      </div>
    </div>
  );
}

export default ActivateAccountPage;
