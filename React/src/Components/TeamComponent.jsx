import React, { useEffect, useState } from "react";
import styles from "./TeamComponent.module.css";
import { FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TeamComponent() {
  const [addButton, setAddButton] = useState(false);
  const [deleteBtnId, setDeleteBtnId] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [name, setName] = useState("");
  const [isUpdate, setUpdate] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const apiUrl = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetchApi();
  }, []);

  async function fetchApi() {
    const result = await fetch(`${apiUrl}user/getUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    if (result.ok) {
      setApiData(data.data);
    } else {
      toast.error(data.message, { position: "top-center" });
    }
  }

  async function addUser() {
    const token = localStorage.getItem("token");
    const userData = { name, email, role };

    try {
      const response = await fetch(`${apiUrl}user/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, { position: "top-center" });
        setAddButton(false);
        setName("");
        setEmail("");
        setRole("member");
        fetchApi();
      } else {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.toString(), { position: "top-center" });
    }
  }

  async function deleteUser(id) {
    try {
      const response = await fetch(`${apiUrl}user/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, { position: "top-center" });
        setDeleteBtnId(null);
        fetchApi();
      } else {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.toString(), { position: "top-center" });
    }
  }

  async function updateUser(id, name, email, role) {
    try {
      const response = await fetch(`${apiUrl}user/editUser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  firstName:name, email, role }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, { position: "top-center" });
        setAddButton(false);
        setName("");
        setEmail("");
        setRole("member");
        setUpdate(false);
        setCurrentEditId(null);
        fetchApi();
      } else {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.toString(), { position: "top-center" });
    }
  }

  function handleEdit(id, name, email, role) {
    setAddButton(true);
    setName(name);
    setEmail(email);
    setRole(role);
    setUpdate(true);
    setCurrentEditId(id);
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {apiData.map((member) => (
            <tr key={member._id}>
              <td className={styles.nameCell}>
                <img
                  src="./profile.png"
                  alt="profile"
                  className={styles.profileImg}
                />
                <span>{member.firstName}</span>
              </td>

              <td>{member.email}</td>
              <td>{member.role === "super_admin" ? "Admin" : member.role}</td>
              {member.role !== "super_admin" && (
                <td className={styles.actionsItems}>
                  <div className={styles.actions}>
                    <FaEdit
                      className={styles.icon}
                      onClick={() =>
                        handleEdit(
                          member._id,
                          member.firstName,
                          member.email,
                          member.role
                        )
                      }
                    />
                    <FaTrash
                      className={styles.icon}
                      onClick={() =>
                        setDeleteBtnId(
                          deleteBtnId === member._id ? null : member._id
                        )
                      }
                    />
                  </div>

                  {deleteBtnId === member._id && (
                    <div className={styles.deleteBtnCont}>
                      <p>This teammate will be deleted.</p>
                      <div className={styles.deleteBtns}>
                        <button
                          className={styles.CancleBtn}
                          onClick={() => setDeleteBtnId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className={styles.confirmBtn}
                          onClick={() => deleteUser(member._id)}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className={styles.addButton}
        onClick={() => {
          setAddButton(true);
          setUpdate(false);
          setName("");
          setEmail("");
          setRole("member");
        }}
      >
        <FaPlusCircle style={{ marginRight: "6px" }} />
        Add Team members
      </button>

      {addButton && (
        <div className={styles.overlay} onClick={() => setAddButton(false)}>
          <div
            className={styles.addTeamCont}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>{isUpdate ? "Edit Team Member" : "Add Team Members"}</h1>
            <p>
              Talk with colleagues in a group chat. Messages in this group are
              only visible to its participants. New teammates may only be
              invited by the administrators.
            </p>
            <label>User name</label>
            <input
              type="text"
              placeholder="User name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Email ID</label>
            <input
              type="text"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Designation</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <div className={styles.addTeamBtns}>
              <button
                className={styles.addTeamCancleBtn}
                onClick={() => setAddButton(false)}
              >
                Cancel
              </button>
              <button
                className={styles.addTeamSaveBtn}
                onClick={() =>
                  isUpdate
                    ? updateUser(currentEditId, name, email, role)
                    : addUser()
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
}
