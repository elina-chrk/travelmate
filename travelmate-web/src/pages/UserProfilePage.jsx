import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function UserProfilePage() {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    country: "",
    bio: "",
    password: ""
  });

  useEffect(() => {
    axiosInstance.get("/users/profile")
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
      .catch((err) => console.error("Помилка завантаження профілю", err));
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
      alert("Профіль оновлено!");
    } catch (err) {
      console.error("❌ Помилка збереження", err);
      alert("Не вдалося оновити профіль.");
    }
  };

  if (!user) return <p>Завантаження...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Мій профіль</h1>

      <div className="space-y-4">
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Ім'я"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Прізвище"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Номер телефону"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Місто"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Країна"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Біо"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="Новий пароль (необов'язково)"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Зберегти
        </button>
      </div>
    </div>
  );
}

export default UserProfilePage;
