import {
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./config/chatLogics";
import { ChatState } from "../Context/ChatProvider";

const formatTimestamp = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const sameYear = date.getFullYear() === now.getFullYear();

  if (isToday) return time;
  if (isYesterday) return `Yesterday, ${time}`;
  if (sameYear)
    return `${date.toLocaleDateString([], { day: "numeric", month: "short" })}, ${time}`;
  return `${date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}, ${time}`;
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div
      style={{
        border: "2px solid green",
        height: "70vh",
        overflow: "scroll",
        borderRadius: "5px",
        backgroundImage:
          'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")',
      }}
    >
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m?._id}>
            {(isSameSender(messages, m, i, user?._id) ||
              isLastMessage(messages, i, user?._id)) && (
              <Tooltip label={m.sender ? m.sender.name : "Test"} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender ? m.sender.name : "Test"}
                  src={m.sender ? m.sender.pic : ""}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: m.sender?._id === user?._id ? "#BEE3F8" : "#B9F5D0",
                marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                marginRight: 10,
                marginTop: isSameUser(messages, m, i, user?._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "6px 12px 4px",
                maxWidth: "75%",
                display: "inline-block",
              }}
            >
              <span style={{ display: "block", wordBreak: "break-word" }}>
                {m.content}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.68em",
                  color: "#555",
                  textAlign: "right",
                  marginTop: "2px",
                  lineHeight: 1,
                  opacity: 0.8,
                }}
              >
                {formatTimestamp(m.createdAt)}
              </span>
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
