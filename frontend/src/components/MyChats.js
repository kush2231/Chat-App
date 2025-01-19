import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSenderName , getSenderPic } from "./config/chatLogics";
import ChatLoading from "./ChatLoading"; // Shimmer loader component
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button, Image } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { BASE_URL } from "./config";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(true); 

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    setLoading(true); 
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${BASE_URL}/api/chat`, config);
      setChats(data);
      setLoading(false); 
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false); 
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    } else {
      console.log("User info not found");
    }

    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      border="2px solid green"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="scroll"
        border="2px solid pink"
      >
        {loading ? ( 
          <ChatLoading /> 
        ) : (
          <Stack overflowY="scroll">
            {chats?.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat?._id}
                display="flex"
                alignItems="center"
              >
                <Image
                  borderRadius="full"
                  boxSize="30px"
                  mr={3}
                  src={
                    getSenderPic(loggedUser, chat.users)
                    || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  }
                  alt={ getSenderName(loggedUser, chat.users) || "Test"}
                />
                <Stack spacing={0} justify="center">
                  <Text fontWeight="bold">
                    {!chat.isGroupChat
                      ? getSenderName(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat?.latestMessage && (
                    <Text fontSize="xs" color="gray.500">
                      <b>
                        {chat.latestMessage.sender?.name || "Test"}:
                      </b>{" "}
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
