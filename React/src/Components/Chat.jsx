import React, { useContext, useEffect, useState } from "react";
import styles from "./Chat.module.css";
import { NavBarContext } from "./Context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Bounce } from "react-toastify";

function timeConverter(time) {
  const date = new Date(time);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${monthName} ${day}, ${year}`;
}

function ChatChip({
  message,
  role,
  index,
  chatNo,
  chatIds,
  chatTime,
  isResolved,
}) {
  const { setChatId, setChatName, setChatTime, setIsResolved } =
    useContext(NavBarContext);

  return (
    <div
      className={`${styles.chatChip} ${styles[role]}`}
      onClick={() => {
        setChatId(chatIds);
        setChatName(chatNo);
        setChatTime(timeConverter(chatTime));
        setIsResolved(isResolved);
      }}
    >
      <div>
        <img src={role == "admin" ? "./img.png" : "./joe.png"} alt="" />
      </div>
      <div className={styles.chatChip1}>
        <p>{chatNo}</p>
        <div className={styles.chatChipFlex}>
          <p key={index}>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { chatId, chatName, chatTime, isResolved, setIsResolved,setNavBar} =
    useContext(NavBarContext);

  const [status, setStatus] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [userData, setUserData] = useState([]);
  const [closeChat, setCloseChat] = useState(true);
  const [isAssign, setAssign] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [assignId, setAssignId] = useState("");
  const [missedChat, setMissedChat] = useState(false);
  


  const apiUrl = import.meta.env.VITE_API_KEY;
  useEffect(() => {
    fetchChatsByStatus("Unresolved");
    fetchApi();
  }, []);
  useEffect(() => {
    setMissedChat(chatData.missedChat);
    setIsResolved(chatData.status == "Unresolved" ? false : true);
  }, [chatData]);
  console.log(chatData);
  console.log(missedChat);
  async function fetchApi() {
    const result = await fetch(`${apiUrl}user/getUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    if (result.ok) {
      setUserData(data.data);
    } else {
      toast.error(data.message, { position: "top-center" });
    }
  }
  useEffect(() => {
    if (chatId) {
      fetchChatsById(chatId);
    }
  }, [chatId, message]);

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
  const fetchChatsById = async (chatId) => {
    try {
      const response = await fetch(`${apiUrl}chat/chatsById/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setChatData(data.data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  const handleSendMessage = async () => {
    const token = localStorage.getItem("token");
    if (!message.trim()) {
      alert("Empty message cannot be sent");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}chat/addMessage/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("");
      } else {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error(error, { position: "top-center" });
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!["resolved", "Unresolved"].includes(newStatus)) {
      alert("Status must be 'resolved' or 'Unresolved'.");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}chat/updateStatus/${chatId}/${newStatus}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        statusUpdate == "closed" ? setIsResolved(true) : setIsResolved(true);
        setStatus(false);
        setStatusUpdate(false);
        updateUserStatus(newStatus == "resolved" ? "increment" : "decrement");

        toast.success(`Status updated to ${newStatus} `, {
          position: "top-center",
        });
      } else {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error(error, { position: "top-center" });
    }
  };
  async function assignChat(userId) {
    

    try {
      const response = await fetch(`${apiUrl}chat/updateAssignedTo/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ newAssigneeId: userId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Assigned successfully", {
          position: "top-center",
        });
        setConfirm(false);
      } else {
        toast.error(data.message || "Failed to assign", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(error.toString(), { position: "top-center" });
    }
  }
  async function updateUserStatus(status) {
    try {
      const token = localStorage.getItem("token");
      const api = await fetch(`${apiUrl}user/updateChatsSolved/${status}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const res = await api.json();
      toast.success(res, message, { position: "top-center" });
    } catch (error) {
      toast.error(error.toString(), { position: "top-center" });
    }
  }

  return (
    <div className={styles.ChatSection}>
      <section className={styles.Chat1}>
        <h3 className={styles.Chath3}>Contact Center</h3>
        <br />
        <br />
        <br />
        <p className={styles.Chatp}>Chats</p>
        <hr className={styles.Chathr} />
        <section>
          {apiData.map((item, index) => {
            return (
              <ChatChip
              key={index}
                message={item.messages[0].message}
                index={index}
                chatNo={`Chat ${index + 1}`}
                chatIds={item._id}
                chatTime={item.startTime}
              />
            );
          })}
        </section>
      </section>
      <section className={styles.Chat2}>
        <div className={styles.ChatMain}>
          <div className={styles.ChatPart1}>
            <h3>Ticket# {chatData.ticketName}</h3>
            <div>
              <img src="./home.png" alt="" onClick={()=>setNavBar("dashboard")} />
            </div>
          </div>
          {closeChat == true ? (
            <div className={styles.chatArea}>
              {chatData.messages &&
                [...chatData.messages]
                  .reverse()
                  .map((item, index) => (
                    <ChatChip
                      key={index}
                      message={item.message}
                      role={item.sender}
                      index={index}
                      chatNo={chatName}
                    />
                  ))}

              {missedChat && (
                <p className={styles.missedChatWarning}>
                  Replying to missed chat{" "}
                </p>
              )}
              <div className={styles.chipTime}>
                <hr className={styles.hr} />
                <p>{chatTime}</p>

                <hr className={styles.hr} />
              </div>
            </div>
          ) : (
            ""
          )}
          {isResolved == true ? (
            <div className={styles.closeChat}>
              <p>This chat has been resolved</p>
            </div>
          ) : (
            <div>
              <div className={styles.inputBox}>
                <img
                  className={styles.sendImg}
                  src="./send.png"
                  alt=""
                  onClick={handleSendMessage}
                />
                <input
                  type="text"
                  placeholder="type here"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </section>
      <section className={styles.Chat3}>
        <div className={styles.ChatSec1}>
          <img className={styles.ChatProfile} src="./img.png" alt="" />
          <p>Chat</p>
        </div>

        <div className={styles.ChatSec2}>
          <p className={styles.BlueP}>Details</p>
          <div className={styles.ChatSec2Items}>
            <img src="./contact.png" alt="" />
            <p>{chatData.userInfo ? chatData.userInfo.name : "No user info"}</p>
          </div>
          <div className={styles.ChatSec2Items}>
            <img src="./phone.png" alt="" />
            <p>
              {chatData.userInfo ? chatData.userInfo.phone : "No user info"}
            </p>
          </div>
          <div className={styles.ChatSec2Items}>
            <img src="./messageChat.png" alt="" />
            <p>
              {chatData.userInfo ? chatData.userInfo.email : "No user info"}
            </p>
          </div>
        </div>
        <div className={styles.ChatSec2}>
          <p className={styles.BlueP}>Teammates</p>
          <div className={styles.ChatSec3} onClick={() => setAssign(!isAssign)}>
            <div className={styles.ChatSecItem}>
              <img src="./team.png" alt="" />
              <p>Team Member</p>
            </div>

            <img className={styles.dropdown} src="./dropdown.png" alt="" />
          </div>
          {isAssign && (
            <div>
              {userData.map((item,index) => (
                <div
                key={index}
                  className={styles.displayTeam}
                  onClick={() => {
                    setConfirm(true);
                    setAssignId(item._id);
                  }}
                >
                  <img src="./girl.png" alt="" />
                  <p>{item.firstName}</p>
                </div>
              ))}
            </div>
          )}
          {isConfirm && (
            <div className={styles.chatStatus}>
              <p>Chat would be assigned to Different team member </p>
              <div className={styles.chatStatusBtn}>
                <button
                  className={styles.chatStatusBtnCancle}
                  onClick={() => setConfirm(false)}
                >
                  Cancle
                </button>
                <button
                  className={styles.chatStatusBtnConfirm}
                  onClick={() => assignChat(assignId)}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          <div>
            <div className={styles.ChatSec3} onClick={() => setStatus(!status)}>
              <div className={styles.ChatSecItem}>
                <img src="./ticket.png" alt="" />
                <p>Ticket status</p>
              </div>

              <img className={styles.dropdown} src="./dropdown.png" alt="" />
            </div>
          </div>
          {status && (
            <div>
              <div
                className={styles.ChatSec3}
                onClick={() => setStatusUpdate("closed")}
              >
                <p style={{ height: "1vh" }} className={styles.ChatSecItem}>
                  Resolved
                </p>
              </div>
              <div
                className={styles.ChatSec3}
                onClick={() => setStatusUpdate("opened")}
              >
                <p style={{ height: "1vh" }} className={styles.ChatSecItem}>
                  Unsolved
                </p>
              </div>
            </div>
          )}
          {statusUpdate && (
            <div className={styles.chatStatus}>
              <p>Chat will be {statusUpdate} </p>
              <div className={styles.chatStatusBtn}>
                <button
                  className={styles.chatStatusBtnCancle}
                  onClick={() => setStatusUpdate(false)}
                >
                  Cancle
                </button>
                <button
                  className={styles.chatStatusBtnConfirm}
                  onClick={() =>
                    handleUpdateStatus(
                      statusUpdate == "closed" ? "resolved" : "Unresolved"
                    )
                  }
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
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
