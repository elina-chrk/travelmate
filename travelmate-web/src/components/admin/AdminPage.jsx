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

  // Функція для завантаження даних
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

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(url, { ...options, headers });
    return res;
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Бан користувача
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
    if (!unbanRecordId) return alert("Please enter banRecordId");
    try {
      await axiosInstance.post(`/admin/unban/${unbanRecordId}`);
      alert("Unbanned successfully");
      setUnbanRecordId("");
      fetchData();
    } catch (error) {
      alert("Error unbanning");
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
              {u.username} ({u.email}) - Banned: {u.isBanned ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Active Users</h2>
        <ul>
          {activeUsers.map((u) => (
            <li key={u.id}>
              {u.username} ({u.email}) - Active: {u.isActive ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Banned Groups</h2>
        <ul>
          {bannedGroups.map((g) => (
            <li key={g.id}>
              {g.title} - Banned: {g.isBanned ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Active Groups</h2>
        <ul>
          {activeGroups.map((g) => (
            <li key={g.id}>{g.title} - Active</li>
          ))}
        </ul>
      </section>

      <hr />

      <form onSubmit={banUser} style={{ marginBottom: "20px" }}>
        <h3>Ban User</h3>
        <input
          type="text"
          placeholder="User ID"
          value={banUserId}
          onChange={(e) => setBanUserId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Reason"
          value={banUserReason}
          onChange={(e) => setBanUserReason(e.target.value)}
          required
        />
        <button type="submit" className="ban">
          Ban User
        </button>
      </form>

      <form onSubmit={banGroup} style={{ marginBottom: "20px" }}>
        <h3>Ban Group</h3>
        <input
          type="text"
          placeholder="Group ID"
          value={banGroupId}
          onChange={(e) => setBanGroupId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Reason"
          value={banGroupReason}
          onChange={(e) => setBanGroupReason(e.target.value)}
          required
        />
        <button type="submit" className="ban">
          Ban Group
        </button>
      </form>

      <form onSubmit={unban}>
        <h3>Unban by Ban Record ID</h3>
        <input
          type="text"
          placeholder="Ban Record ID"
          value={unbanRecordId}
          onChange={(e) => setUnbanRecordId(e.target.value)}
          required
        />
        <button type="submit" className="unban">
          Unban
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
