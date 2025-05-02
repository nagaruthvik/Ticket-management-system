import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PasswordStrengthBar from "react-password-strength-bar";
import styles from "./SignUpPage.module.css";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cPassword: "",
  });

  const handleFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.cPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    setIsLoading(true);
    try {
      const fetchApi = await fetch(`${apiUrl}user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const response = await fetchApi.json();

      if (fetchApi.status !== 201) {
        toast.error(response.message, { position: "top-center" });
      } else {
        toast.success(response.message, { position: "top-center" });
        navigate("/signIn");
      }
    } catch (e) {
      toast.error(e, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className={styles.loadingCont}>
          <div className={styles.lodingBar}></div>
        </div>
      )}

      <form className={styles.mainForm} onSubmit={handleFormSubmit}>
        <section className={styles.formSection}>
          <div className={styles.logBanner}>
            <img src="./icon.png" alt="" />
            <h1>Hubly</h1>
          </div>
          <h1 className={styles.h1Mobile}>Sign Up to your Spark</h1>
          <div className={styles.createAccount}>
            <h2 className={styles.h1Desk}>Create an account</h2>
            <Link to="/signin">Sign in instead</Link>
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="firstName">First name</label>
            <input
              className={styles.inputFields}
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleFormData}
              required
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="lastName">Last name</label>
            <input
              className={styles.inputFields}
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleFormData}
              required
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="email">Email</label>
            <input
              className={styles.inputFields}
              type="text"
              id="email"
              value={formData.email}
              onChange={handleFormData}
              required
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="password">Password</label>
            <input
              className={styles.inputFields}
              type="password"
              id="password"
              value={formData.password}
              onChange={handleFormData}
              required
            />
            <PasswordStrengthBar password={formData.password} />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="cPassword">Confirm Password</label>
            <input
              className={styles.inputFields}
              type="password"
              id="cPassword"
              value={formData.cPassword}
              onChange={handleFormData}
              required
            />
          </div>

          <div className={styles.checkBox}>
            <input type="checkbox" required />
            <p className={styles.checkBoxP}>
              By creating an account, I agree to our Terms of use and Privacy
              Policy
            </p>
          </div>

          <input
            className={styles.createAccountBtn}
            type="submit"
            value="Create an account"
            disabled={isLoading}
          />

          <p className={styles.captcha}>
            This site is protected by reCAPTCHA and the{" "}
            <u>Google Privacy Policy</u> and <u>Terms of Service apply</u>.
          </p>
        </section>
        <section className={styles.imgSection}>
          <img src="./banner.png" alt="" />
        </section>
      </form>

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
    </>
  );
}
