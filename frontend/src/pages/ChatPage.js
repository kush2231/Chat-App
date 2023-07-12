import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
// import Chatbox from "../components/Chatbox";
// import MyChats from "../components/MyChats";
// import SideDrawer from "../components/miscellaneous/SideDrawer";
// import { ChatState } from "../Context/ChatProvider";
import axios from "axios";

const Chatpage = () => {

  // const [fetchAgain, setFetchAgain] = useState(false);
  // const { user } = ChatState();
  const [data, setdata] = useState("hey");
  const fetchchats = async() => {
    const response = await axios.get('http://localhost:3000/api/chat')
    setdata(response.data);
    console.log(response.data);
  }
  // fetchchats()
  useEffect(()=>{
    fetchchats()
  },[])

  return (
    <div style={{ width: "100%" }}>
           hello world 
    </div>
  );
};

export default Chatpage;
