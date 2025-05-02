import React, { useContext, useState } from "react";
import styles from "./NavBarComponent.module.css";
import { NavBarContext } from "./Context";
import { Link, useNavigate } from "react-router";
import Dashboard from "./Dashboard";
import Chat from "./Chat";
import ChatBot from "./ChatBot"
import TeamComponent from "./TeamComponent";
import Analytics from "./Analytics";
import UserSettings from "./UserSetting";


export default function NavBarComponent() {
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const { navBar, setNavBar } = useContext(NavBarContext);

  const handleClick = (e) => {
    e.preventDefault();
    setNavBar(e.currentTarget.dataset.value);
  };
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  };

  return (
    <div className={styles.homePage}>
      <nav className={styles.navBarComp}>
        <section className={styles.navBarItems}>
          <div id={styles.mobileComp} className={styles.compAlign}>
            <img src="./icon.png" alt="" />
          </div>
          <button
            className={styles.evntAlign}
            data-value="dashboard"
            onClick={handleClick}
          >
            <img src="./home.png" alt="home" />
            {navBar === "dashboard" ? <p>Dashboard</p> : <p></p>}
          </button>
          <button
            className={styles.evntAlign}
            data-value="message"
            onClick={handleClick}
          >
            <img src="./messageicon.png" alt="booking" />
            {navBar === "message" ? <p>Contact Center</p> : <p></p>}
          </button>
          <button
            className={styles.evntAlign}
            data-value="analytics"
            onClick={handleClick}
          >
            <img src="./analytics.png" alt="time" />
            {navBar === "analytics" ? <p>Analytics</p> : <p></p>}
          </button>
          <button
            className={styles.evntAlign}
            data-value="chatbot"
            onClick={handleClick}
          >
            <img src="./chatbot.png" alt="Chat bot" />
            {navBar === "chatbot" ? <p>Chat bot</p> : <p></p>}
          </button>
          <button
            className={styles.evntAlign}
            data-value="team"
            onClick={handleClick}
          >
            <img src="./team.png" alt="settings" />
            {navBar === "team" ? <p>Team</p> : <p></p>}
          </button>
          <button
            className={styles.evntAlign}
            data-value="settings"
            onClick={handleClick}
          >
            <img src="./setting.png" alt="settings" />
            {navBar === "settings" ? <p>Setting</p> : <p></p>}
          </button>
        </section>
        <section
          onClick={() => setLogout(!logout)}
          id={styles.mobileComp}
          className={styles.profileBanner}
        >
          <img src="./profiles.png" alt="" />

          {logout && (
            <div className={styles.logout} onClick={handleLogout}>
              
              <p>Sign out</p>
            </div>
          )}
        </section>
      </nav>
      <div className={styles.mainBarComp}>
        {navBar === "dashboard" ? <Dashboard /> : ""}
        {navBar === "message" ? <Chat /> : ""}
        {navBar === "analytics" ? <Analytics/> : ""}
        {navBar === "chatbot" ? <ChatBot/>: ""}
        {navBar === "team" ? <TeamComponent/> : ""}
        {navBar === "settings" ? <UserSettings/> : ""}

      </div>
    </div>
  );
}
