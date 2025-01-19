import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from './Context/ChatProvider';

import { getToken } from "firebase/messaging";
import { messaging } from "./Firebase/firebaseConfig.js";

const vapidKey = process.env.REACT_APP_VAPID_KEY;

// Use vapidKey where needed


async function requestPermission() {
  // Requesting permission using Notification API
  console.log("Requesting permission");
  
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
    });

    // We can send token to the server
    console.log("Token generated : ", token);
  } else if (permission === "denied") {
    // Notifications are blocked
    alert("You denied the notification");
  }
}

function App() {
  // Move useEffect inside the App component
  // useEffect(() => {
  //   requestPermission();
  // }, []);

  return (
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Homepage />} exact />
              <Route path="/chats" element={<ChatPage />} />
            </Routes>
          </div>
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
