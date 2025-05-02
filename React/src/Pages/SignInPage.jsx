import React, {  useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router";
import styles from "./SignPage.module.css";


export default function SignInPage() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [ isLoading, setLoading ] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fetchApi = await fetch(`${apiUrl}user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const response = await fetchApi.json();

      if (fetchApi.status !== 200) {
        toast.error(response.message, { position: "top-center" });
      } else {
        
        localStorage.setItem("token",response.token)
        toast.success(response.message, { position: "top-center" });
        navigate("/HomePage")
      }
    } catch (e) {
      
      toast.error(e, { position: "top-center" });
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

      <form className={styles.mainForm} onSubmit={handleFormSubmit}>
        <section className={styles.formSection}>
          <div className={styles.logBanner}>
            <img src="./icon.png" alt="" />
            <h1>Hubly</h1>
          </div>
          <h1 className={styles.singIn}>Sign in to your Plexify</h1>
          <h1 className={styles.h1Mobile}>Sign in to your Plexify</h1>

          <div className={styles.labelInput}>
            <label className={styles.mobileLabel} htmlFor="email">
              Email
            </label>
            <input
              className={`${styles.inputFields} ${styles.desktopLabel}`}
              type="text"
              id="email"
              value={formData.email}
              onChange={handleFormData}
              
              required
            />
          </div>

          <div className={styles.labelInput}>
            <label className={styles.mobileLabel} htmlFor="password">
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                className={`${styles.inputFields} ${styles.desktopLabel}`}
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleFormData}
                
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <img style={{ width: "2vh", height: "2vh" }} src="./view.png" alt="" />
                ) : (
                  <img src="./eye.png" alt="" />
                )}
              </button>
            </div>
          </div>

          <input className={styles.createAccountBtn} type="submit" value="Log in" />
          <p className={styles.dontHaveAcc}>
            Don't have an account?<Link to="/signup">Sign up</Link>
          </p>
          <p className={styles.displayEnd}>
            This site is protected by reCAPTCHA and the <u>Google Privacy Policy</u> and{" "}
            <u>Terms of Service apply</u>.
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
