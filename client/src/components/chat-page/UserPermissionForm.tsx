import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useThemeContext } from "./ThemeContext";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.md_table.header_bg,
  color: theme.palette.md_table.header_text,
}));

const UserPermissionForm = ({
  initialData,
  handleSendMessage,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const { mode } = useThemeContext(); // Access the current theme mode

  // Create state for form data with empty emails
  const [formData, setFormData] = useState(
    initialData.map((item) => ({
      ...item,
      email: "",
    }))
  );

  // Available permission options
  const permissionOptions = ["agent", "buyer", "admin", "seller", "guest"];

  // Handle email change
  const handleEmailChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].email = value;
    setFormData(newFormData);
  };

  // Handle permission selection
  const handlePermissionChange = (index, permission) => {
    const newFormData = [...formData];

    // If permission already exists, remove it, otherwise add it
    if (newFormData[index].permission.includes(permission)) {
      newFormData[index].permission = newFormData[index].permission.filter(
        (p) => p !== permission
      );
    } else {
      newFormData[index].permission = [
        ...newFormData[index].permission,
        permission,
      ];
    }

    setFormData(newFormData);
  };

  // Generate markdown table from form data
  const generateMarkdownTable = (data) => {
    let markdown = "| Role | Email | Permissions |\n";
    markdown += "| --- | --- | --- |\n";

    data.forEach((item) => {
      markdown += `| ${item.role} | ${item.email} | ${item.permission.join(", ")} |\n`;
    });

    return markdown;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const markdownTable = generateMarkdownTable(formData);

    handleSendMessage(markdownTable);

    // Close the dialog after submission
    onClose();
  };

  // Handle form cancellation
  const handleCancel = () => {
    // Reset the form to initial state with empty emails
    setFormData(
      initialData.map((item) => ({
        ...item,
        email: "",
      }))
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle sx={{ backgroundColor: theme.palette.background.paper }}>
        <Typography
          variant="h5"
          component="div"
          fontWeight="bold"
          color="text.primary"
        >
          User Permission Form
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: theme.palette.background.paper }}>
        <form onSubmit={handleSubmit}>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              mb: 3,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Permissions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        index % 2 === 0
                          ? theme.palette.background.default
                          : theme.palette.background.paper,
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                      }}
                    >
                      {item.role}
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="email"
                        value={item.email}
                        onChange={(e) =>
                          handleEmailChange(index, e.target.value)
                        }
                        placeholder="Enter email"
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: theme.palette.chat_input.text_box,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormGroup row>
                        {permissionOptions.map((permission) => (
                          <FormControlLabel
                            key={permission}
                            control={
                              <Checkbox
                                checked={item.permission.includes(permission)}
                                onChange={() =>
                                  handlePermissionChange(index, permission)
                                }
                                name={permission}
                                size="small"
                                color="primary"
                              />
                            }
                            label={
                              <Typography color="text.primary">
                                {permission}
                              </Typography>
                            }
                          />
                        ))}
                      </FormGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 3, backgroundColor: theme.palette.background.paper }}
      >
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="inherit"
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.primary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.side_panel.primary_btn,
            "&:hover": {
              backgroundColor: theme.palette.side_panel.primary_btn_hover,
            },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPermissionForm;
