import './App.css';
import React from 'react'
 import { Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from 'react-router-dom'
import ChatProvider from './Context/ChatProvider';
function App() {
  return (
      <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
    <div  className="App">
    <Routes >
    <Route path="/" element={<Homepage/>}   exact /> 
    <Route path="/chats" element={<ChatPage/>} /> 
  
      </Routes>
      </div>
      </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
    

  );
}

export default App;
