import React, { useEffect, useState } from "react";
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
          fetch("/api/admin/users/banned"),
          fetch("/api/admin/users/active"),
          fetch("/api/admin/groups/banned"),
          fetch("/api/admin/groups/active"),
        ]);
      const bannedUsersData = await bannedUsersRes.json();
      const activeUsersData = await activeUsersRes.json();
      const bannedGroupsData = await bannedGroupsRes.json();
      const activeGroupsData = await activeGroupsRes.json();

      setBannedUsers(bannedUsersData.data || []);
      setActiveUsers(activeUsersData.data || []);
      setBannedGroups(bannedGroupsData.data || []);
      setActiveGroups(activeGroupsData.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Бан користувача
  const banUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/ban/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: banUserId, reason: banUserReason }),
      });
      if (res.ok) {
        alert("User banned successfully");
        setBanUserId("");
        setBanUserReason("");
        fetchData();
      } else {
        alert("Failed to ban user");
      }
    } catch (error) {
      alert("Error banning user");
    }
  };

  // Бан групи
  const banGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/ban/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: banGroupId, reason: banGroupReason }),
      });
      if (res.ok) {
        alert("Group banned successfully");
        setBanGroupId("");
        setBanGroupReason("");
        fetchData();
      } else {
        alert("Failed to ban group");
      }
    } catch (error) {
      alert("Error banning group");
    }
  };

  // Розбан користувача або групи по banRecordId
  const unban = async (e) => {
    e.preventDefault();
    if (!unbanRecordId) return alert("Please enter banRecordId");
    try {
      const res = await fetch(`/api/admin/unban/${unbanRecordId}`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Unbanned successfully");
        setUnbanRecordId("");
        fetchData();
      } else {
        alert("Failed to unban");
      }
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
            <li key={g.id}>
              {g.title} - Active
            </li>
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
        <button type="submit" className="ban">Ban User</button>
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
        <button type="submit" className="ban">Ban Group</button>
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
        <button type="submit" className="unban">Unban</button>
      </form>
    </div>
  );
};

export default AdminPage;
