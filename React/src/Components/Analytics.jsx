import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

import styles from "./Analytics.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Dot,
} from "recharts";

const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle cx={cx} cy={cy} r={5} stroke="black" strokeWidth={3} fill="#fff" />
  );
};
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#000",
          padding: "1vh 5vh",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Chats
        <br />
        {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const [missedChat, setMissedChat] = useState([]);
  const [allChat, setAllChats] = useState([]);
  const [reChat, setReChats] = useState([]);
  const [value, setValue] = useState(0);
  const [avgReply,setAvgReply] = useState(0)
  const data = [
    {
      name: "Progress",
      value: value,
      fill: "#00FF00",
    },
  ];

  function chatPrecentage(totalChats, resolvedChats) {

    const percentage =
      totalChats > 0 ? Math.round((resolvedChats / totalChats) * 100) : 0;

    setValue(percentage);
  }

  useEffect(() => {
    fetchMissedChats();
    fetchChatsByStatus("all");
    fetchChatsByStatus("resolved");
    
  }, []);

  useEffect(() => {
    if (allChat.length) {
      const avgReply = calculateAverageReplyTime(allChat);
      setAvgReply(avgReply)
     
    }
  }, [allChat]);

  useEffect(() => {
    if (allChat.length && reChat.length) {
      chatPrecentage(allChat.length, reChat.length);
    }
  }, [allChat, reChat]);

  async function fetchMissedChats() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${apiUrl}chat/missed-chats-weekly/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        setMissedChat(data);
      } else {
        throw new Error("Failed to fetch missed chats");
      }
    } catch (error) {
      console.error("Error fetching missed chats:", error);
    }
  }
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
        if (status === "resolved") {
          setReChats(data.data);
        } else {
          setAllChats(data.data);
        }
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  function calculateAverageReplyTime(chats) {
    let totalReplyTime = 0;
    let count = 0;

    chats.forEach((chat) => {
      const userMsg = chat.messages.find((m) => m.sender === "user");
      const adminMsg = chat.messages.find((m) => m.sender === "admin");

      if (userMsg && adminMsg) {
        const userTime = new Date(userMsg.timestamp);
        const adminTime = new Date(adminMsg.timestamp);
        const diffInSeconds = (adminTime - userTime) / 1000;

        if (diffInSeconds >= 0) {
          totalReplyTime += diffInSeconds;
          count++;
        }
      }
    });

    const averageInSeconds = count > 0 ? totalReplyTime / count : 0;
    return averageInSeconds;
  }

  
  return (
    <div className={styles.AnalyticsBoard}>
      <h4>Analytics</h4>
      <h2>Missed Chats</h2>
      <div className={styles.graph}>
        <ResponsiveContainer>
          <LineChart data={missedChat}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="chats"
              stroke="#00D907"
              strokeWidth={4}
              dot={<CustomDot />}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.analytics}>
        <h2 className={styles.green}>Average Reply time</h2>
        <div className={styles.analyticsPart1}>
          <p>
            For highest customer satisfaction rates you should aim to reply to
            an incoming customer's message in 15 seconds or less. Quick
            responses will get you more conversations, help you earn customers
            trust and make more sales.
          </p>
          <h1 className={styles.green}>{Math.floor(avgReply)}secs</h1>
        </div>
      </div>
      <div className={styles.analytics}>
        <h2 className={styles.green}>Resolved Tickets</h2>
        <div className={styles.analyticsPart1}>
          <p>
            A callback system on a website, as well as proactive invitations,
            help to attract even more customers. A separate round button for
            ordering a call with a small animation helps to motivate more
            customers to make calls.
          </p>
          <div className={styles.chatCircle}>
            <RadialBarChart
              width={120}
              height={120}
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              barSize={15}
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                clockWise
                dataKey="value"
                cornerRadius={15}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={22}
                fill="#000"
                fontWeight="bold"
              >
                {data[0].value}%
              </text>
            </RadialBarChart>
          </div>
        </div>
      </div>
      <div className={styles.analytics}>
        <h2>Total Chats</h2>
        <div className={styles.analyticsPart1}>
          <p>
            This metric Shows the total number of chats for all Channels for the
            selected the selected period
          </p>
          <h1 className={styles.green}>{allChat.length} Chats</h1>
        </div>
      </div>
    </div>
  );
}
