import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  SxProps,
  useTheme,
} from "@mui/material";
import { useThemeContext } from "./ThemeContext"; // Import your theme context

interface BugReportButtonProps {
  buttonSx?: SxProps;
  chat_id: string;
  chat_messages: any[];
  apiEndpoint?: string;
}

interface NotificationState {
  open: boolean;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface BugReportData {
  message: string;
  metadata: {
    userAgent: string;
    timestamp: string;
    url: string;
    screenSize: string;
    theme_mode: string;
    [key: string]: any; // Allow for additional metadata
  };
}

const BugReportButton: React.FC<BugReportButtonProps> = ({
  buttonSx = {},
  chat_id,
  chat_messages = [],
  apiEndpoint = "DEFAULT_API_ENDPOINT",
}) => {
  const theme = useTheme();
  const { mode } = useThemeContext(); // Get theme mode from your context
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    type: "success",
    message: "",
  });

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setMessage("");
  };

  const handleSubmit = async (): Promise<void> => {
    if (!message.trim()) {
      setNotification({
        open: true,
        type: "error",
        message: "Please enter a bug description",
      });
      return;
    }

    setLoading(true);

    // Collect metadata
    const bugReportData: BugReportData = {
      message,
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        chat_messages: chat_messages,
        chat_id: chat_id,
        theme_mode: mode, // Include the current theme mode
      },
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bugReportData),
      });

      if (response.ok) {
        setNotification({
          open: true,
          type: "success",
          message: "Bug report submitted successfully!",
        });
        handleClose();
      } else {
        throw new Error("Failed to submit bug report");
      }
    } catch (error) {
      setNotification({
        open: true,
        type: "error",
        message: "Failed to submit bug report. Please try again.",
      });
      console.error("Error submitting bug report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ): void => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        sx={{
          m: 2,
          color: "white",
          bgcolor: theme.palette.side_panel.primary_btn,
          border: "1px solid",
          borderColor: theme.palette.divider,
          borderRadius: 5,
          transition: "background-color 0.2s, transform 0.1s",
          "&:hover": {
            bgcolor: theme.palette.side_panel.primary_btn_hover,
            transform: "scale(1.02)",
          },
          ...buttonSx,
        }}
      >
        Report Bug
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Report a Bug</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="bug-description"
            label="Please describe the issue you're experiencing"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                bgcolor: theme.palette.chat_input.text_box,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            color="primary"
            sx={{
              borderRadius: 2,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: theme.palette.side_panel.primary_btn,
              "&:hover": {
                bgcolor: theme.palette.side_panel.primary_btn_hover,
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.type}
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BugReportButton;
