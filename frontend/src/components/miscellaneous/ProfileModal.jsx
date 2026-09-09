import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setUser } = ChatState();
  const toast = useToast();

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Chat-App");
      formData.append("cloud_name", "kushagragupta");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/kushagragupta/image/upload",
        { method: "POST", body: formData }
      );
      const cloudData = await cloudRes.json();
      const cloudinaryUrl = cloudData.url.toString();

      // 2. Update pic in DB
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${BASE_URL}/api/user/update-pic`,
        { userId: user._id, pic: cloudinaryUrl },
        config
      );

      // 3. Update preview and global user state + localStorage
      setPreview(cloudinaryUrl);
      const updatedUser = { ...user, pic: cloudinaryUrl };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      toast({
        title: "Profile picture updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update picture",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user?.name || "Test"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image
                borderRadius="full"
                boxSize="150px"
                cursor={uploading ? "not-allowed" : "pointer"}
                onClick={!uploading ? handleImageClick : undefined}
                src={preview || user?.pic}
                alt={user?.name || "Profile"}
                opacity={uploading ? 0.5 : 1}
              />
              {uploading && (
                <Spinner
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  color="green.400"
                  size="lg"
                />
              )}
            </div>
            <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
              Email: {user?.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
