import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const api_Url = "https://jsonplaceholder.typicode.com/users";
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null); 
    const [newData, setNewData] = useState({
      name: "",
      email: "",
      phone: "",
      company: {
        name: "",
      },
    });

  const usersPerPage = 3;

  const fetchData = async (page) => {
    try {
      const response = await axios.get(api_Url, {
        params: {
          _page: page,
          _limit: usersPerPage,
        },
      });
      const data = response.data;
      setUsers(data);
      setTotalPages(
        Math.ceil(response.headers["x-total-count"] / usersPerPage)
      );
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleEdit = (user) => {

    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

const handleSaveEdit = async (editedUser) => {
  try {
    await axios.put(`${api_Url}/${editedUser.id}`, editedUser);
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === editedUser.id ? editedUser : user))
    );
    setEditingUser(null);
  } catch (error) {
    console.log("Error editing user", error);
  }
};

const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`${api_Url}/${id}`);

    if (response.status !== 200) {
      return;
    }
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  } catch (error) {
    console.log("Error deleting user", error);
  }
};


  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(api_Url, newData);

      if (response.status === 201) {
        console.log("Data added successfully!");
        fetchData(currentPage); 
        setNewData({
          name: "",
          email: "",
          phone: "",
          company: {
            name: "",
          },
        });
      } else {
        console.log("Failed to add data");
      }
    } catch (error) {
      console.error("Error adding data", error);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="font-bold">Add user</h1>
        <form className="border" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder="Enter the name"
              value={newData.name}
              onChange={handleChange}
              className="border rounded px-2 py-1 mr-2"
              required
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="border rounded px-2 py-1 mr-2"
              required
            />
          </label>
          <br />
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={newData.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="border rounded px-2 py-1 mr-2"
              required
            />
          </label>
          <br />
          <label>
            Company Name:
            <input
              type="text"
              name="companyName"
              value={newData.company.name}
              onChange={(e) =>
                setNewData((prevData) => ({
                  ...prevData,
                  company: {
                    ...prevData.company,
                    name: e.target.value,
                  },
                }))
              }
              placeholder="Enter Company Name"
              className="border rounded px-2 py-1 mr-2"
              required
            />
          </label>

          <br />
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
            type="submit"
          >
            Add Data
          </button>
        </form>
      </div>

      <div>
        {users.map((user) => (
          <div
            className="border border-gray-300 p-4 bg-white text-center"
            key={user.id}
          >
            {editingUser && editingUser.id === user.id ? (
              <div>
                <h3>Edit User</h3>
                <label>
                  Name:
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="text"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                  />
                </label>
                <label>
                  Company Name:
                  <input
                    type="text"
                    value={editingUser.company.name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        company: {
                          ...editingUser.company,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </label>
                <button
                  onClick={() => handleSaveEdit(editingUser)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3>Name - {user.name}</h3>
                <h4>Email - {user.email}</h4>
                <h4>Phone - {user.phone}</h4>
                <h4>Company Name - {user.company.name}</h4>
                <div className="gap-4 text-center justify-between space-x-4 m-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="gap-4 text-center justify-between space-x-4 m-2">
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Prev
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          {currentPage}
        </button>
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
