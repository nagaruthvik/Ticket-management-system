import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatBot.module.css";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
export default function ChatBot() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [headColor, setHeadColor] = useState("#33475b");
  const [bgColor, setBgColor] = useState("#eeeeee");
  const [customMess1, setCustomMess1] = useState("How can I help you?");
  const [customMess2, setCustomMess2] = useState("Ask me anything");
  const [name, setName] = useState("Your name");
  const [phone, setPhone] = useState("+1 (000) 000-0000");
  const [email, setEmail] = useState("example@gmail.com");
  const [btn, setBtn] = useState("Thank you!");
  const [message, setMessage] = useState(
    "👋 Want to chat about Hubly? I'm a chatbot here to help you find your way."
  );
  const [savedTime, setSavedTime] = useState("");

  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const TimeColumn = ({ items, selected, onChange }) => {
    const containerRef = useRef(null);
    const itemRefs = useRef([]);

    useEffect(() => {
      const selectedIndex = items.indexOf(selected);
      const selectedEl = itemRefs.current[selectedIndex];
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, [selected]);

    return (
      <div className={styles.rollerColumn} ref={containerRef}>
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`${styles.rollerItem} ${
              item === selected ? styles.active : ""
            }`}
            onClick={() => onChange(item)}
          >
            {item.toString().padStart(2, "0")}
          </div>
        ))}
      </div>
    );
  };

  async function fetchChatBotData() {
    try {
      const response = await fetch(`${apiUrl}chatbot/chatbot`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        setHeadColor(data.headColor);
        setBgColor(data.bgColor);
        setCustomMess1(data.customMessage1);
        setCustomMess2(data.customMessage2);
        setEmail(data.email);
        setName(data.name);
        setPhone(data.phone);
        setBtn(data.btn);
        setMessage(data.message);
      } else {
        console.error("Error fetching data:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function updateChatbot() {
    const updatedData = {
      headColor,
      bgColor,
      customMessage1: customMess1,
      customMessage2: customMess2,
      name,
      phone,
      email,
      btn,
      message,
    };

    try {
      const response = await fetch(`${apiUrl}chatbot/chatbotupdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        
        toast.error("Failed to update chatbot settings",{ position: "top-center"})
      }

      const result = await response.json();
      console.log("Updated chatbot settings:", result);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  }
  async function updateMissedTime() {
    setSavedTime(`${hours}:${minutes}:${seconds}`);
    console.log(savedTime);
    const updatedData = {
      savedTime: savedTime,
    };
    try {
      const response = await fetch(`${apiUrl}chatbot/chatbotupdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        toast.error("Failed to update chatbot settings",{ position: "top-center"})
      }

      const result = await response.json();
      toast.success(result.message, {
        position: "top-center",
      });
    } catch (error) {

      toast.error(error, {
        position: "top-center",
      });
    }
  }

  useEffect(() => {
    fetchChatBotData();
  }, [apiUrl]);

  useEffect(() => {
    if (!apiUrl) return;
    const timeout = setTimeout(() => {
      updateChatbot();
    }, 500);
    return () => clearTimeout(timeout);
  }, [
    headColor,
    bgColor,
    customMess1,
    customMess2,
    name,
    phone,
    email,
    btn,
    message,
    savedTime,
  ]);

  return (
    <div className={styles.ChatBotMain}>
      <div className={styles.ChatBotPart1}>
        <p>Chat Bot</p>
      </div>

      <div className={styles.ChatBotPart2}>
        <div className={styles.ChatBotChat}>
          <div
            style={{ backgroundColor: headColor }}
            className={styles.ChatBotHeading}
          >
            <img src="./bot.png" alt="bot" />
            <p>Hubly</p>
          </div>

          <div
            style={{ backgroundColor: bgColor }}
            className={styles.ChatBotChatArea}
          >
            <div className={styles.ChatTextImg}>
              <img src="./bot.png" alt="bot" />
              <div className={styles.ChatText}>
                <p>{customMess1}</p>
              </div>
            </div>

            <div
              className={styles.ChatText}
              style={{
                marginLeft: "7vh",
                marginTop: "1vh",
                marginBottom: "5vh",
              }}
            >
              <p>{customMess2}</p>
            </div>

            <div className={styles.ChatBotDetails}>
              <p>Introduction Yourself</p>
              <p className={styles.ChatHeading}>Your name</p>
              <p>{name}</p>
              <hr />
              <p className={styles.ChatHeading}>Your Phone</p>
              <p>{phone}</p>
              <hr />
              <p className={styles.ChatHeading}>Your Email</p>
              <p>{email}</p>
              <hr />
              
              <button className={styles.ChatBotBtn}>Thnak you</button>
            </div>
          </div>

          <div className={styles.sentMessage}>
            <p>Write a message</p>
            <img src="./sent.png" alt="send icon" />
          </div>

          <div className={styles.chatMessageBox}>
            <div className={styles.chatMessage}>
              <img src="./bot.png" alt="bot" />
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ChatBotPart3}>
        <div className={styles.customColor}>
          <p>Header Color</p>
          <div className={styles.customColorIcon}>
            <div
              className={styles.customWhite}
              onClick={() => setHeadColor("white")}
            />
            <div
              className={styles.customBlack}
              onClick={() => setHeadColor("black")}
            />
            <div
              className={styles.customBlue}
              onClick={() => setHeadColor("#33475b")}
            />
          </div>
          <div className={styles.customColorIcon}>
            <input
              type="color"
              value={headColor}
              onChange={(e) => setHeadColor(e.target.value)}
            />
            <input
              type="text"
              value={headColor}
              onChange={(e) => setHeadColor(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.customColor}>
          <p>Custom Background Color</p>
          <div className={styles.customColorIcon}>
            <div
              className={styles.customWhite}
              onClick={() => setBgColor("white")}
            />
            <div
              className={styles.customBlack}
              onClick={() => setBgColor("black")}
            />
            <div
              className={styles.customBlue}
              onClick={() => setBgColor("#eeeeee")}
            />
          </div>
          <div className={styles.customColorIcon}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.customColor}>
          <p>Customize Message</p>
          <div className={styles.editMessage}>
            <div className={styles.inputMessage}>
              <input
                type="text"
                value={customMess1}
                onChange={(e) => setCustomMess1(e.target.value)}
              />
              <img src="./editic.png" alt="edit" />
            </div>
            <div className={styles.inputMessage}>
              <input
                type="text"
                value={customMess2}
                onChange={(e) => setCustomMess2(e.target.value)}
              />
              <img src="./editic.png" alt="edit" />
            </div>
          </div>
        </div>

        <div className={styles.customColor}>
          <div className={styles.ChatBotDetailEdit}>
            <p>Introduction Yourself</p>
            <p className={styles.ChatHeading}>Your name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <hr />
            <p className={styles.ChatHeading}>Your Phone</p>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <hr />
            <p className={styles.ChatHeading}>Your Email</p>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <hr />
            <div className={styles.ChatBotBtnEdit}>
              <input
                type="text"
                value={btn}
                onChange={(e) => setBtn(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.customColor}>
          <p>Welcome Message</p>
          <div className={styles.editText}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <img src="./editic.png" alt="edit" />
          </div>
        </div>

        <div className={styles.customColor}>
          <p>Missed chat timer</p>
          <div className={styles.rollerContainer}>
            <TimeColumn
              items={range(0, 23)}
              selected={hours}
              onChange={setHours}
            />
            <div className={styles.colon}>:</div>
            <TimeColumn
              items={range(0, 59)}
              selected={minutes}
              onChange={setMinutes}
            />
            <div className={styles.colon}>:</div>
            <TimeColumn
              items={range(0, 59)}
              selected={seconds}
              onChange={setSeconds}
            />
          </div>
          <button className={styles.saveBtn} onClick={updateMissedTime}>
            Save
          </button>
        </div>
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
  );
}
