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
  Theme,
  SxProps,
} from "@mui/material";

interface BugReportButtonProps {
  theme: Theme;
  buttonSx?: SxProps;
  chat_id: string;
  chat_messages: any;
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
    [key: string]: any; // Allow for additional metadata
  };
}

const BugReportButton: React.FC<BugReportButtonProps> = ({
  theme,
  buttonSx = {},
  chat_id,
  chat_messages = [],
  apiEndpoint = "DEFAULT_API_ENDPOINT",
}) => {
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
          transition: "background-color 0.2s",
          "&:hover": {
            bgcolor: theme.palette.side_panel.primary_btn_hover,
          },
          ...buttonSx,
        }}
      >
        Report Bug
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Report a Bug</DialogTitle>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
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
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BugReportButton;
