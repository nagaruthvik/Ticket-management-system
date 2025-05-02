import React, { createContext, useState } from 'react';
const NavBarContext = createContext(); 

export default function Context({ children }) {
  
    const [chatId,setChatId] = useState("680b2f20682fe0da92511e91")
    const [navBar,setNavBar] = useState("dashboard")
    const [chatName,setChatName] = useState("Chat 1")
    const [chatTime,setChatTime] = useState("March 7, 2025")
    const [isResolved,setIsResolved] = useState(false)
    return (
        <NavBarContext.Provider value={{chatId,setChatId,navBar,setNavBar,chatName,setChatName,chatTime,setChatTime,isResolved,setIsResolved}}>
          {children} 
        </NavBarContext.Provider>
      );
}

export { NavBarContext }; 