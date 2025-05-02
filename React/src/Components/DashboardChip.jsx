import React, { useContext, useEffect } from "react";
import styles from "./DashboardChip.module.css";
import { NavBarContext } from "./Context";
export default function DashboardChip({
  ticketId,
  ticketName,
  time,
  message,
  name,
  email,
  phone,
  timeDiff,
  miss,
}) {
  const apiUrl = import.meta.env.VITE_API_KEY;
  

  useEffect(() => {
    handleMissChat()
  }, []);

  async function handleMissChat() {
    try {
      const api = await fetch(`${apiUrl}chat/missedChat/${ticketId}/${miss}`, {
        method: "PUT",
      });
      const res = await api.json();

      if (!res.ok) {
        console.log(res.message);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const { setNavBar, setChatId } = useContext(NavBarContext);

  function handleOpenTicket(id) {
    setNavBar("message");
    setChatId(id);
  }

  return (
    <div className={styles.DashboardChip}>
      <div className={styles.DashboardChipAlign}>
        <div className={styles.DashboardChipAlign}>
          <div className={styles.DashboardLogo}></div>
          <h3> Ticket# {ticketName}</h3>
        </div>
        <p>Posted at {time}</p>
      </div>
      <div className={styles.DashboardChipAlign}>
        <p>{message}</p>
        <h2>{timeDiff}</h2>
      </div>
      <div>
        <hr />
        <div className={styles.DashboardChipAlign}>
          <div className={styles.DashboardChipDetails}>
            <img src="./img.png" alt="" />
            <div className={styles.DashboardChipDetailsp}>
              <p>{name}</p>
              <p>{phone}</p>
              <p>{email}</p>
            </div>
          </div>

          <div>
            <p
              className={styles.openticket}
              onClick={() => handleOpenTicket(ticketId)}
            >
              <u>Open Ticket</u>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
