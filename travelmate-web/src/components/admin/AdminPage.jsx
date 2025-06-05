import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./AdminPage.css";

const AdminPage = () => {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [bannedGroups, setBannedGroups] = useState([]);
  const [activeGroups, setActiveGroups] = useState([]);

  const [banUserId, setBanUserId] = useState("");
  const [banUserReason, setBanUserReason] = useState("");

  const [banGroupId, setBanGroupId] = useState("");
  const [banGroupReason, setBanGroupReason] = useState("");

  const [unbanRecordId, setUnbanRecordId] = useState("");
  const [unbanType, setUnbanType] = useState(""); 

  const fetchData = async () => {
    try {
      const [bannedUsersRes, activeUsersRes, bannedGroupsRes, activeGroupsRes] =
        await Promise.all([
          axiosInstance.get("/admin/users/banned"),
          axiosInstance.get("/admin/users/active"),
          axiosInstance.get("/admin/groups/banned"),
          axiosInstance.get("/admin/groups/active"),
        ]);

      setBannedUsers(bannedUsersRes.data.data || []);
      setActiveUsers(activeUsersRes.data.data || []);
      setBannedGroups(bannedGroupsRes.data.data || []);
      setActiveGroups(activeGroupsRes.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const banUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/ban/user", {
        userId: banUserId,
        reason: banUserReason,
      });
      alert("User banned successfully");
      setBanUserId("");
      setBanUserReason("");
      fetchData();
    } catch (error) {
      alert("Error banning user");
    }
  };

  const banGroup = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/ban/group", {
        groupId: banGroupId,
        reason: banGroupReason,
      });
      alert("Group banned successfully");
      setBanGroupId("");
      setBanGroupReason("");
      fetchData();
    } catch (error) {
      alert("Error banning group");
    }
  };

  const unban = async (e) => {
    e.preventDefault();
    if (!unbanRecordId || !unbanType) {
      return alert("Please enter banRecordId and select type");
    }
    try {
      await axiosInstance.post(`/admin/unban/${unbanType}/${unbanRecordId}`);
      alert("Unbanned successfully");
      setUnbanRecordId("");
      setUnbanType("");
      fetchData();
    } catch (error) {
      alert("Error unbanning");
    }
  };

  const handleBanUser = async (userId) => {
    const reason = prompt("Вкажіть причину блокування:");
    if (!reason) return;
    try {
      await axiosInstance.post("/admin/ban/user", { userId, reason });
      fetchData();
    } catch (err) {
      alert("Не вдалося заблокувати користувача");
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await axiosInstance.post(`/admin/unban/user/${userId}`);
      fetchData();
    } catch (err) {
      alert("Не вдалося розблокувати користувача");
    }
  };

  const handleBanGroup = async (groupId) => {
    const reason = prompt("Вкажіть причину блокування групи:");
    if (!reason) return;
    try {
      await axiosInstance.post("/admin/ban/group", { groupId, reason });
      fetchData();
    } catch (err) {
      alert("Не вдалося заблокувати групу");
    }
  };

  const handleUnbanGroup = async (groupId) => {
    try {
      await axiosInstance.post(`/admin/unban/group/${groupId}`);
      fetchData();
    } catch (err) {
      alert("Не вдалося розблокувати групу");
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>

      <section>
        <h2>Banned Users</h2>
        <ul>
          {bannedUsers.map((u) => (
            <li key={u.id}>
              {u.username} ({u.email}) – Заблоковано
              <button
                onClick={() => handleUnbanUser(u.id)}
                className="unban-btn"
              >
                Розблокувати
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Active Users</h2>
        <ul>
          {activeUsers.map((u) => (
            <li key={u.id}>
              {u.username} ({u.email}) – Активний
              <button onClick={() => handleBanUser(u.id)} className="ban-btn">
                Заблокувати
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Banned Groups</h2>
        <ul>
          {bannedGroups.map((g) => (
            <li key={g.id}>
              {g.title} – Заблоковано
              <button
                onClick={() => handleUnbanGroup(g.id)}
                className="unban-btn"
              >
                Розблокувати
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Active Groups</h2>
        <ul>
          {activeGroups.map((g) => (
            <li key={g.id}>
              {g.title} – Активна
              <button onClick={() => handleBanGroup(g.id)} className="ban-btn">
                Заблокувати
              </button>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      
    </div>
  );
};

export default AdminPage;
