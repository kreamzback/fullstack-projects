import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel ({ token }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/all', authConfig);
      setUsers(res.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch users')
    }
    
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setError('');
      const res = await axios.delete(`http://localhost:3000/admin/${userId}`, authConfig);
      setMessage(res.data.message);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <p className="card-lead">Review accounts and remove users if needed.</p>
      {error && <p className="alert alert-error">{error}</p>}
      {message && <p className="alert alert-ok">{message}</p>}

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>
                  <span className="role-pill">{u.role}</span>
                </td>
                <td>
                  <button className="btn-danger" onClick={() => handleDeleteUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
