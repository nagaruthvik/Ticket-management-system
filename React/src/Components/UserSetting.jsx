import React, { useEffect, useState } from "react";
import styles from "./UserSettings.module.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

export default function UserSettings() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [warnings, setWarnings] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function GetUserDet() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}user/getUserId`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.data._id);
        setFormData((prev) => ({
          ...prev,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          email: data.data.email,
        }));
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  useEffect(() => {
    GetUserDet();
  }, []);
  
  const handleSubmit = async (e) => {
    
    e.preventDefault();
  
    if (formData.password !== formData.cPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }
    let data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };
  
    if (formData.password !== "") {
      data.password = formData.password;
    }
  

  
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}user/editUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to update user");
      }
  
      toast.success(result.message, { position: "top-center" });
      navigate("/");
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {isLoading && (
        <div className={styles.loadingCont}>
          <h2 className={styles.simpleLoader}></h2>
        </div>
      )}
      <div className={styles.settingMain}>
        <div>
          <h4>Profile</h4>
        </div>
        <div className={styles.settingForm}>
          <p>Edit</p>
          <hr />
          <form className={styles.settingFormValues} onSubmit={handleSubmit}>
            {["firstName", "lastName", "email", "password", "cPassword"].map(
              (field, idx) => (
                <div key={idx} className={styles.settingFormFeild}>
                  <label>
                    {field === "cPassword"
                      ? "Confirm Password"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className={styles.divAlign}>
                    <input
                      className={styles.settingFormInput}
                      type={field.includes("password") ? "password" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                    <img
                      onClick={() =>
                        setWarnings((prev) => ({
                          ...prev,
                          [field]: !prev[field],
                        }))
                      }
                      src="./warning.png"
                      alt="!"
                    />
                    {warnings[field] && (
                      <div className={styles.warning}>
                        <p>User will be logged out immediately</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            <div className={styles.saveBtn}>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
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
    </>
  );
}
