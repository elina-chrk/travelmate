import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserProfilePage.css";

function UserProfilePage() {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    country: "",
    bio: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/users/profile")
      .then((res) => {
        setUser(res.data);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          phoneNumber: res.data.phoneNumber || "",
          city: res.data.city || "",
          country: res.data.country || "",
          bio: res.data.bio || "",
          password: ""
        });
      })
      .catch((err) => console.error("❌ Помилка завантаження профілю", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/users/${userId}`, formData);
      alert("✅ Профіль оновлено!");
      setFormData((prev) => ({
        ...prev,
        password: ""
      }));
    } catch (err) {
      console.error("❌ Помилка збереження", err);
      alert("Не вдалося оновити профіль.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (!user) return <p>Завантаження...</p>;

  return (
    <div className="profile-wrapper">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Назад
      </button>
      <h1 className="profile-title">Мій профіль</h1>

      <div className="profile-form">
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Ім'я"
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Прізвище"
        />
        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Номер телефону"
        />
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Місто"
        />
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Країна"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Біо"
        />

        <div className="password-input-wrapper">
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Новий пароль (необов'язково)"
          />
          <button
            type="button"
            className="toggle-password-text"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Сховати пароль" : "Показати пароль"}
          </button>
        </div>

        <button onClick={handleSave} className="profile-save-button">
          Зберегти
        </button>
      </div>
    </div>
  );
}

export default UserProfilePage;
