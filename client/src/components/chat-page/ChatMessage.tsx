// ChatMessage.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Markdown } from "./MarkdownComp";
// import Image from "next/image";
import { ChatMessageProps } from "./constants";
// import logo from "../../../public/assets/png/gpt-loader.png";

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isSentByUser,
  fileUrls,
  fileNames,
  avatarUrl,
}) => {
  const theme = useTheme();
    const [showLoader, setLoader] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoader(false);
      }, 500);
  
      return () => clearTimeout(timer); // cleanup (optional but good practice)
    }, []);

  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    return fileExtension ? imageExtensions.includes(fileExtension) : false;
  };
  // theme.palette.primary.main;
  return (
    <Box
      className="p-2"
      sx={{
        bgcolor: isSentByUser
          ? theme.palette.chat_window.user_bg
          : theme.palette.chat_window.ai_bg,
        maxWidth: "60vw",
        borderRadius: 2,
        width: "max-content",
        marginLeft: isSentByUser ? "auto" : undefined,
        position: "relative",
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-4 items-start">
          <div className="chat-ai-spinner-wrap flex-shrink-0">
            {/* {!isSentByUser && showLoader && <Image src={logo} alt="Logo" width={24} height={24} />} */}
          </div>
          <Typography
            sx={{
              fontSize: "1em",
              marginTop: 0.8,
              color: theme.palette.text.primary,
              marginLeft: isSentByUser ? -1.5 : 0,
            }}
          >
            {/* {isSentByUser && !avatarUrl ? "You:" : "AI:"} */}
          </Typography>
          <div>
            <div
              className="whitespace-normal m-1"
              style={{
                color: theme.palette.text.primary,
              }}
            >
              <Markdown>{message}</Markdown>

              {Array.isArray(fileUrls) &&
                Array.isArray(fileNames) &&
                fileUrls.length > 0 &&
                fileNames.length > 0 && (
                  <Box mt={1} className="flex flex-col gap-2">
                    {fileUrls.map((url, index) => (
                      <div key={index}>
                        {isImageFile(fileNames[index]) ? (
                          <img
                            src={url}
                            alt={`Uploaded image ${index + 1}`}
                            width={450}
                            height={450}
                            className="rounded-lg"
                          />
                        ) : (
                          // <a
                          //   href={url}
                          //   target="_blank"
                          //   rel="noopener noreferrer"
                          //   className="text-yellow-400 hover:text-yellow-300"
                          // >
                          //   <Typography variant="body2">
                          //     {fileNames[index]}
                          //   </Typography>
                          // </a>
                          ""
                        )}
                      </div>
                    ))}
                  </Box>
                )}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ChatMessage;
