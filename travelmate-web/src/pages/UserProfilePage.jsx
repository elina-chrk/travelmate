import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserProfilePage.css";

function UserProfilePage() {
  const { userId, logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    country: "",
    bio: "",
    password: "",
    dateOfBirth: "",
    avatarUrl: "",
  });

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
          password: "",
          dateOfBirth: res.data.dateOfBirth?.slice(0, 10) || "",
          avatarUrl: res.data.avatarUrl || "",
        });
      })
      .catch((err) => console.error("❌ Помилка завантаження профілю", err));
  }, []);

  const getFileName = (url) => {
    if (typeof url !== "string") return "";
    return url.split("/").pop();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (overrideData = null) => {
    try {
      const dataToSave = overrideData || formData;
      const payload = {
        firstName: dataToSave.firstName,
        lastName: dataToSave.lastName,
        phoneNumber: dataToSave.phoneNumber,
        city: dataToSave.city,
        country: dataToSave.country,
        bio: dataToSave.bio,
        password: dataToSave.password || undefined,
        dateOfBirth: dataToSave.dateOfBirth
          ? `${dataToSave.dateOfBirth}T12:00:00Z`
          : null,
        avatarUrl: dataToSave.avatarUrl,
      };

      await axiosInstance.put(`/users/${userId}`, payload);
      alert("✅ Профіль оновлено!");
      setFormData((prev) => ({
        ...prev,
        password: "",
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
        <div className="avatar-wrapper">
          <label htmlFor="avatar-upload" className="avatar-upload-label">
            {formData.avatarUrl ? (
              <img
  src={`http://localhost:8080/api/avatars/${getFileName(formData.avatarUrl)}?v=${crypto.randomUUID()}`}
  alt="Avatar"
  className="profile-avatar"
/>

            ) : (
              <div className="avatar-placeholder">+</div>
            )}
          </label>
          <input
            type="file"
            id="avatar-upload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                const uploadForm = new FormData();
                uploadForm.append("file", file);

                const res = await axiosInstance.post("/avatars", uploadForm, {
                  headers: { "Content-Type": "multipart/form-data" },
                });

                console.log("Нова аватарка:", res.data);

                const newAvatarUrl = res.data.avatarUrl;

                const updatedForm = {
                  ...formData,
                  avatarUrl: newAvatarUrl,
                };

                setFormData(updatedForm);

                await handleSave(updatedForm);

             //   alert("✅ Аватарка оновлена та профіль збережено.");
               // window.location.reload();
              } catch (err) {
                console.error("❌ Помилка завантаження аватарки", err);
                alert("Не вдалося завантажити аватарку.");
              }
            }}
          />
        </div>

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
        <label htmlFor="dateOfBirth" className="profile-label">
          Дата народження
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
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

        <button onClick={() => handleSave()} className="profile-save-button">
          Зберегти
        </button>

        <button
          className="delete-account-button"
          onClick={() => setShowDeleteConfirm(true)}
        >
          🗑 Видалити акаунт
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Ви впевнені, що хочете видалити свій акаунт?</p>
            <div className="modal-buttons">
              <button
                className="confirm-button"
                onClick={async () => {
                  try {
                    await axiosInstance.delete("/users/me");
                    logout();
                    alert("Акаунт видалено.");
                    window.location.href = "/login";
                  } catch (err) {
                    console.error("❌ Помилка видалення акаунту", err);
                    alert("Не вдалося видалити акаунт.");
                  }
                }}
              >
                Так, видалити
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Повернутися назад
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
