import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import DashboardChip from "./DashboardChip";

export default function Dashboard() {
  const [isclicked, setIsclicked] = useState("all");
  const [apiData, setApiData] = useState([]);
  const [missedTime, setMissedTime] = useState("");
  const [searchTicket, setSearchTicket] = useState(""); 

  const apiUrl = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetchChatsByStatus(isclicked);
  }, [isclicked]);

  useEffect(() => {
    fetchChatBotData();
    fetchByTicketName("2025-0050");
  }, []);

  const fetchByTicketName = async (name) => {
    try {
      const response = await fetch(`${apiUrl}chat/chatsByTicketName/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setApiData(data.data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const fetchChatsByStatus = async (status) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}chat/chatsByStatus/${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setApiData(data.data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  async function fetchChatBotData() {
    try {
      const response = await fetch(`${apiUrl}chatbot/chatbot`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        setMissedTime(data.savedTime);
      } else {
        console.error("Error fetching data:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function timeConverter(time) {
    const date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  }

  function timeDifference(time) {
    const providedTime = new Date(time);
    const currentTime = new Date();

    const differenceInMilliseconds = currentTime - providedTime;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);

    return `${differenceInHours}:${differenceInMinutes % 60}`;
  }

  function isSecondTimeGreater(firstTime, secondTime) {
    const firstTimeArray = firstTime.split(":").map(Number);
    const secondTimeArray = secondTime.split(":").map(Number);

    if (secondTimeArray[0] > firstTimeArray[0]) {
      return true;
    } else if (secondTimeArray[0] === firstTimeArray[0]) {
      if (secondTimeArray[1] > firstTimeArray[1]) {
        return true;
      }
    }

    return false;
  }

 
  const filteredData = apiData.filter((item) =>
    item.ticketName.toLowerCase().includes(searchTicket.toLowerCase())
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardSticky}>
        <header>
          <p className={styles.dashboardP}>Dashboard</p>
        </header>
        <div className={styles.dashboardInput}>
          <img src="./search.png" alt="" />
          Ticket #
          <input
            className={styles.dashboardInputBox}
            type="text"
            placeholder="Search for ticket"
            value={searchTicket}
            onChange={(e) => setSearchTicket(e.target.value)}
          />
        </div>

        <nav className={styles.dashboardNav}>
          <p
            onClick={() => setIsclicked("all")}
            style={{
              borderBottom: isclicked === "all" ? "0.8vh solid #184E7F" : "",
            }}
          >
            All Tickets
          </p>
          <p
            onClick={() => setIsclicked("resolved")}
            style={{
              borderBottom: isclicked === "resolved" ? "0.8vh solid #184E7F" : "",
            }}
          >
            Resolved
          </p>
          <p
            onClick={() => setIsclicked("Unresolved")}
            style={{
              borderBottom: isclicked === "Unresolved" ? "0.8vh solid #184E7F" : "",
            }}
          >
            Unresolved
          </p>
        </nav>
      </div>

      <main className={styles.dashboardMain}>
        {filteredData.map((item) => {
          return (
            <DashboardChip
              ticketId={item._id}
              ticketName={item.ticketName}
              time={timeConverter(item.startTime)}
              message={item.messages[0].message}
              name={item.userInfo.name}
              email={item.userInfo.email}
              phone={item.userInfo.phone}
              timeDiff={timeDifference(item.startTime)}
              key={item._id}
              miss={isSecondTimeGreater(
                missedTime,
                timeDifference(item.startTime)
              )}
            />
          );
        })}
      </main>
    </div>
  );
}
