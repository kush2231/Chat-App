import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";


function Homepage() {
  const Navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(user);
    if (user) Navigate("/chats");
  }, [Navigate]);

  return (
    <Container maxW="xl" centerContent>

      <Box
        d="flex" 
        justifyContent="center" // Horizontally center content
        alignItems="center" // Vertically center content
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center" // Optional: Align text inside the box
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Chat-App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
