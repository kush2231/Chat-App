import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
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
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user: loggedInUser, setUser } = ChatState();
  const toast = useToast();
  const isOwnProfile = loggedInUser?._id === user?._id;

  // Pic state
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPreview(null);
    onClose();
  };

  // ── Profile picture ──────────────────────────────────────────────────────
  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
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

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      };
      await axios.put(
        `${BASE_URL}/api/user/update-pic`,
        { userId: loggedInUser._id, pic: cloudinaryUrl },
        config
      );

      setPreview(cloudinaryUrl);
      const updated = { ...loggedInUser, pic: cloudinaryUrl };
      setUser(updated);
      localStorage.setItem("userInfo", JSON.stringify(updated));

      toast({ title: "Profile picture updated!", status: "success", duration: 3000, isClosable: true, position: "bottom" });
    } catch (err) {
      toast({ title: "Failed to update picture", description: err.message, status: "error", duration: 4000, isClosable: true, position: "bottom" });
    } finally {
      setUploading(false);
    }
  };

  // ── Password ─────────────────────────────────────────────────────────────
  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast({ title: "Please fill all password fields", status: "warning", duration: 3000, isClosable: true, position: "bottom" });
    }
    if (newPassword !== confirmPassword) {
      return toast({ title: "New passwords do not match", status: "warning", duration: 3000, isClosable: true, position: "bottom" });
    }
    if (newPassword.length < 6) {
      return toast({ title: "Password must be at least 6 characters", status: "warning", duration: 3000, isClosable: true, position: "bottom" });
    }

    setPwdLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      };
      await axios.put(
        `${BASE_URL}/api/user/update-password`,
        { currentPassword, newPassword },
        config
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Password updated successfully!", status: "success", duration: 3000, isClosable: true, position: "bottom" });
    } catch (err) {
      toast({
        title: "Failed to update password",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={handleClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="40px" fontFamily="Work sans" textAlign="center">
            {user?.name || "Test"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="center">
              {/* Avatar */}
              <div style={{ position: "relative", display: "inline-block" }}>
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  cursor={isOwnProfile && !uploading ? "pointer" : "default"}
                  onClick={isOwnProfile && !uploading ? handleImageClick : undefined}
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
                {isOwnProfile && (
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                )}
              </div>

              {isOwnProfile && (
                <Text fontSize="xs" color="gray.500">
                  Click photo to change
                </Text>
              )}

              <Text fontSize={{ base: "22px", md: "24px" }} fontFamily="Work sans">
                Email: {user?.email}
              </Text>

              {/* Password section — only for own profile */}
              {isOwnProfile && (
                <>
                  <Divider />
                  <Text fontWeight="semibold" alignSelf="flex-start" fontSize="md">
                    Change Password
                  </Text>

                  <InputGroup size="md" width="100%">
                    <Input
                      pr="4.5rem"
                      type={showCurrent ? "text" : "password"}
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={showCurrent ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowCurrent((v) => !v)}
                        aria-label="Toggle current password"
                      />
                    </InputRightElement>
                  </InputGroup>

                  <InputGroup size="md" width="100%">
                    <Input
                      pr="4.5rem"
                      type={showNew ? "text" : "password"}
                      placeholder="New password (min 6 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={showNew ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowNew((v) => !v)}
                        aria-label="Toggle new password"
                      />
                    </InputRightElement>
                  </InputGroup>

                  <InputGroup size="md" width="100%">
                    <Input
                      pr="4.5rem"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={showConfirm ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label="Toggle confirm password"
                      />
                    </InputRightElement>
                  </InputGroup>

                  <Button
                    colorScheme="green"
                    width="100%"
                    isLoading={pwdLoading}
                    onClick={handlePasswordUpdate}
                  >
                    Update Password
                  </Button>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
