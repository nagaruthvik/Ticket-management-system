import React, { useEffect, useState } from "react";
import styles from "./LandingPage.module.css";
import { Link, useNavigate } from "react-router";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChatChip({ message, role, index }) {
  return (
    <div className={`${styles.chatChip} ${styles[role]}`}>
      <div className={styles.chatChip1}>
        <div className={styles.chatChipFlex}>
          <p key={index}>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [chatOption, setChatOption] = useState(false);
  const [name, setName] = useState("Your name");
  const [phone, setPhone] = useState("+1 (000) 000-0000");
  const [email, setEmail] = useState("example@gmail.com");
  const [btn, setBtn] = useState("Thank you!");
  const [headColor, setHeadColor] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [customMess1, setCustomMess1] = useState("");
  const [customMess2, setCustomMess2] = useState("");
  const [message, setMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [displayChat, setDisplayChat] = useState("");
  const [popup, setpopup] = useState(true);
  const createNewChat = async () => {
    try {
      const dataUser = {
        userInfo: { name, phone, email },
        endTime: "2025-05-01T18:00:00.000Z",
        messages: [
          {
            sender: "user",
            message: "hey",
            timestamp: new Date().toISOString(),
          },
        ],
      };
      const response = await fetch(`${apiUrl}chat/newChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUser),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("details sent", { position: "top-center" });
        setChatOption(false);
        localStorage.setItem("email", email);
      } else {
        
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  useEffect(() => {
    fetchChatBotData();
    getMessage();
  }, []);
  useEffect(() => {
    getMessage();
  }, [userMessage]);

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
  const sendUserMessage = async (email, messageText) => {
    try {
      const response = await fetch(`${apiUrl}chat/addMessageUser/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Message added:", result.data);
      } else {
        console.error("Server error:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getMessage = async () => {
    const email = localStorage.getItem("email");
    if (email) {
      try {
        const response = await fetch(`${apiUrl}chat/chatsByEmail/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (response.ok) {
          setDisplayChat(result.data);
        } else {
          console.error("Server error:", result.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };

  console.log(displayChat);
  return (
    <div>
      <div className={styles.LandingMain}>
        <nav className={styles.navCont}>
          <div className={styles.logo}>
            <img src="./icon.png" alt="Logo" />
            <h1>Hubly</h1>
          </div>
          <div>
            <button onClick={() => navigate("/SignIn")} id={styles.loginBtn}>
              Login
            </button>
            <button onClick={() => navigate("/SignUp")} id={styles.signUpBtn}>
              Sign up
            </button>
          </div>
        </nav>

        <main className={styles.mainLanding}>
          <div className={styles.LandingMainCont}>
            <div className={styles.section1}>
              <h1>
                <b>Grow Your Business Faster with Hubly CRM</b>
              </h1>
              <p>
                Manage leads, automate workflows, and close deals
                effortlessly—all in one powerful platform.
              </p>
              <div className={styles.section2}>
                <button className={styles.lpbtn1}>Get started →</button>
                <button className={styles.lpBtn2}>
                  <div className={styles.btnStyle}>
                    <div className={styles.playBtn}>▶</div>
                    <p>
                      <b>Watch Video</b>
                    </p>
                  </div>
                </button>
              </div>
            </div>
            <div>
              <div className={styles.img1}>
                <img src="./lpbanner.png" alt="" />
              </div>
              <div className={styles.img2}>
                <img src="./Calendar.png" alt="" />
              </div>
              <div className={styles.img3}>
                <img src="./analysis.png" alt="" />
              </div>
              <div className={styles.img4}>
                <img src="./pro.png" alt="" />
              </div>
            </div>
          </div>

          <div className={styles.company}>
            <img src="./adobe.png" alt="" />
            <img src="./elastic.png" alt="" />
            <img src="./opendoor.png" alt="" />
            <img src="./elastic.png" alt="" />
            <img src="./farmer.png" alt="" />
          </div>

          <div className={styles.subMain1}>
            <div>
              <h1 className={styles.blueHeading}>
                At its core, Hubly is a robust CRM <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;solution.
              </h1>
              <p>
                Hubly helps businesses streamline customer interactions, track
                leads, and automate tasks—saving you time and maximizing
                revenue. Whether you’re a startup or an enterprise, Hubly adapts
                to your needs, giving you the tools to scale efficiently.
              </p>
            </div>
          </div>
          <section className={styles.subMain2}>
            <div>
              <div>
                <h4 className={styles.blueHeading}>
                  MULTIPLE PLATFORMS TOGETHER!
                </h4>
                <p>
                  Email communication is a breeze with our fully integrated,
                  drag & drop email builder.
                </p>
              </div>
              <div>
                <h4 className={styles.blueHeading}>CLOSE</h4>
                <p>
                  Capture leads using our landing pages, surveys, forms,
                  calendars, inbound phone system & more!
                </p>
              </div>
              <div>
                <h4 className={styles.blueHeading}>NURTURE</h4>
                <p>
                  Capture leads using our landing pages, surveys, forms,
                  calendars, inbound phone system & more!
                </p>
              </div>
            </div>

            <div className={styles.subMain2Img}>
              <div className={styles.rectangles}>
                <img className={styles.social} src="./social.png" alt="" />

                <div className={styles.rectangle1}></div>
                <div className={styles.rectangle2}></div>
                <div className={styles.rectangle3}></div>
                <div className={styles.arrow1}>
                  CAPTURE <img src="./arrow.png" alt="" />
                </div>
                <div className={styles.arrow2}>
                  NURTURE <img src="./arrow.png" alt="" />
                </div>
                <div className={styles.arrow3}>
                  CLOSE <img src="./arrow.png" alt="" />
                </div>
              </div>
            </div>
          </section>

          <h1 className={styles.blueHeading}>We have plans for everyone!</h1>
          <p>
            We started with a strong foundation, then simply built all of the
            sales and marketing tools ALL businesses need under one platform.
          </p>
          <section className={styles.subMain3}>
            <div className={styles.chip1}>
              <h2>STARTER</h2>
              <p>
                Best for local businesses needing to improve their online
                reputation.
              </p>
              <div
                style={{ color: "#3A7ABD", fontSize: "1.3rem" }}
                className={styles.displayInline}
              >
                <h1>$199</h1>
                <p>/monthly</p>
              </div>

              <h4>what's included</h4>
              <div className={styles.subMain3Items}>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />

                  <p>Unlimited Users</p>
                </div>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />
                  <p>GMB Messaging</p>
                </div>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />
                  <p>Reputation Management</p>
                </div>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />
                  <p>GMB Call Tracking</p>
                </div>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />
                  <p>24/7 Award Winning Support</p>
                </div>
              </div>
              <button className={styles.chipBtn}>SIGN UP FOR STARTER</button>
            </div>
            <div className={styles.chip2}>
              <h2>Grow</h2>
              <p>
                Best for all businesses that want to take full control of their
                marketing automation and track their leads, click to close.
              </p>
              <div
                style={{ color: "#3A7ABD", fontSize: "1.3rem" }}
                className={styles.displayInline}
              >
                <h1>$199</h1>
                <p>/monthly</p>
              </div>

              <h4>what's included</h4>
              <div className={styles.subMain3Items}>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />

                  <p>Pipeline Management</p>
                </div>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />
                  <p>Marketing Automation Campaigns</p>
                </div>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />
                  <p>Live Call Transfer</p>
                </div>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />
                  <p>GMB Messaging</p>
                </div>
                <div className={styles.displayInline}>
                  <img src="./Checkicon.png" alt="" />
                  <p>Embed-able Form Builder</p>
                </div>
              </div>
              <button className={styles.chipBtn}>SIGN UP FOR STARTER</button>
            </div>
          </section>
        </main>
        <footer className={styles.footerMain}>
          <div className={styles.logo}>
            <img src="./icon.png" alt="" />
            <h1>Hubly</h1>
          </div>

          <div>
            <p>
              <strong>Product</strong>
            </p>
            <p>Universal checkout</p>
            <p>Payment workflows</p>
            <p>Observability</p>
            <p>UpliftAI</p>
            <p>Apps & integrations</p>
            <br />
            <br />
            <br />
            <br />
            <p>
              <strong>Resources</strong>
            </p>
            <p>Blog</p>
            <p>Success stories</p>
            <p>News room</p>
            <p>Terms</p>
            <p>Privacy</p>
          </div>
          <div>
            <p>
              <strong>Why Prime</strong>
            </p>
            <p>Expand to new markets</p>
            <p>Boost payment success</p>
            <p>Improve conversion rates</p>
            <p>Reduce payments fraud</p>
            <p>Universal checkout</p>
            <br />
            <br />
            <br />
            <br />
            <p>
              <strong>Company</strong>
            </p>
            <p>Recover revenue</p>
          </div>
          <div className={styles.footerPart3}>
            <p>
              <strong>Developers</strong>
            </p>
            <div>
              <p>Primer Docs</p>
              <p>API Reference</p>
              <p>Payment methods guide</p>
              <p>Service status</p>
              <p>Community</p>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className={styles.socialLogos}>
              <img src="./message.png" alt="" />
              <img src="./linkin.png" alt="" />
              <img src="./x.png" alt="" />
              <img src="./youtube.png" alt="" />
              <img src="./discord.png" alt="" />
              <img src="./figma.png" alt="" />
              <img src="./instagram.png" alt="" />
            </div>
          </div>
        </footer>
      </div>
      {popup && (
        <div className={styles.botMessage}>
          <img
            className={styles.closeBtn}
            onClick={() => setpopup(false)}
            src="./cross.png"
            alt=""
          />
          <img src="./bot.png" alt="" />
          <p>{message}</p>
        </div>
      )}

      <div
        className={styles.chatOption}
        onClick={() => setChatOption(!chatOption)}
      >
        <img src="./bigChat.png" alt="" />
      </div>
      {chatOption && (
        <div className={styles.chatBox}>
          <div
            className={styles.chatBoxHead}
            style={{ backgroundColor: headColor }}
          >
            <img src="./bot.png" alt="" />
            <p>Hubly</p>
          </div>
          <div
            className={styles.chatBackground}
            style={{ backgroundColor: bgColor }}
          >
            <div
              className={styles.admin}
              style={{ backgroundColor: "white", padding: "2vh" }}
            >
              {customMess1}
            </div>
            <div
              className={styles.admin}
              style={{ backgroundColor: "white", padding: "2vh" }}
            >
              {customMess2}
            </div>
            <div
              className={styles.message1}
              style={{ marginRight: "2vh", padding: "2vh" }}
            >
              Hey
            </div>
            <div className={styles.message2}>
              {" "}
              <img src="./bot.png" alt="" />{" "}
              <div className={styles.inputs}>
                <p>Introduction Yourself</p>
                <label htmlFor="">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <hr />
                <label htmlFor="">Your Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <hr />
                <label htmlFor="">Your Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <hr />
                <button
                  className={styles.chatBotButton}
                  onClick={createNewChat}
                >
                  {btn}
                </button>
              </div>
            </div>
            <div className={styles.chatArea}>
              {displayChat.messages &&
                displayChat.messages.map((item, index) => {
                  return (
                    <ChatChip
                      key={index}
                      message={item.message}
                      role={item.sender}
                      index={index}
                      chatNo="Chat 1"
                    />
                  );
                })}
            </div>
            <br />
            <div
              className={`${styles.enterMessage} ${
                localStorage.getItem("email") == null
                  ? styles.disabledInput
                  : ""
              }`}
            >
              <input
                className={`${
                  localStorage.getItem("email") == null
                    ? styles.disabledInput
                    : ""
                }`}
                type="text"
                placeholder="Write a message"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendUserMessage(localStorage.getItem("email"), userMessage);
                    setUserMessage("");
                  }
                }}
                disabled={localStorage.getItem("email") == null}
              />{" "}
              <img
                src="./sent.png"
                alt=""
                onClick={() => {
                  sendUserMessage(localStorage.getItem("email"), userMessage);
                  setUserMessage("");
                }}
              />
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
