// TimelineEditForm.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { useThemeContext } from "./ThemeContext";

interface TimelineItem {
  "Process Step": string;
  Owner: string;
  "Due Date": Date | string;
  Status: string;
  list_index?: number;
}

interface FormData {
  deal_id: string;
  timeline_data_dict_list: TimelineItem[];
  address_from_rpa_doc: string;
  rpa_version: string;
}

interface TimelineEditFormProps {
  initialData: FormData;
  open: boolean;
  onClose: () => void;
  onSubmit: (markdown: string, raw_data: string) => void;
}

const TimelineEditForm: React.FC<TimelineEditFormProps> = ({
  initialData,
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const [formData, setFormData] = useState<FormData>({
    deal_id: "",
    timeline_data_dict_list: [],
    address_from_rpa_doc: "",
    rpa_version: "",
  });

  // Initialize form data with proper structure
  useEffect(() => {
    if (initialData) {
      const processedTimelineData =
        initialData.timeline_data_dict_list?.map((item) => {
          return {
            "Process Step": item["Process Step"],
            Owner: item["Owner"],
            "Due Date":
              typeof item["Due Date"] === "string"
                ? item["Due Date"]
                : item["Due Date"] instanceof Date
                  ? item["Due Date"]
                  : new Date(item["Due Date"]),
            Status: item["Status"],
            list_index: item.list_index,
          };
        }) || [];

      setFormData({
        deal_id: initialData.deal_id || "",
        timeline_data_dict_list: processedTimelineData,
        address_from_rpa_doc: initialData.address_from_rpa_doc || "",
        rpa_version: initialData.rpa_version || "",
      });
    } else {
      setFormData({
        deal_id: "",
        timeline_data_dict_list: [],
        address_from_rpa_doc: "",
        rpa_version: "",
      });
    }
  }, [initialData]);

  const handleDateChange = (index: number, date: Date | null) => {
    if (date) {
      const newTimelineData = [...formData.timeline_data_dict_list];
      newTimelineData[index]["Due Date"] = date;
      setFormData({
        ...formData,
        timeline_data_dict_list: newTimelineData,
      });
    }
  };

  const handleStatusChange = (index: number, status: string) => {
    const newTimelineData = [...formData.timeline_data_dict_list];
    newTimelineData[index]["Status"] = status;
    setFormData({
      ...formData,
      timeline_data_dict_list: newTimelineData,
    });
  };

  const generateMarkdownTable = (data: TimelineItem[]) => {
    let markdown = "# Project Timeline\n\n";

    markdown += "| Process Step | Owner | Due Date | Status |\n";
    markdown += "| --- | --- | --- | --- |\n";

    data.forEach((item) => {
      const dueDate =
        typeof item["Due Date"] === "string"
          ? item["Due Date"]
          : format(item["Due Date"] as Date, "yyyy-MM-dd");

      markdown += `| ${item["Process Step"]} | ${item["Owner"]} | ${dueDate} | ${item["Status"]} |\n`;
    });

    return markdown;
  };

  const handleSubmit = () => {
    const markdownTable = generateMarkdownTable(
      formData.timeline_data_dict_list
    );
    console.log("Final JSON data:", JSON.stringify(formData, null, 2));
    onSubmit(
      markdownTable,
      "@@@TIMELINE@@@" + JSON.stringify(formData, null, 2)
    );
    onClose();
  };

  const parseDate = (dateField: Date | string): Date | null => {
    if (dateField instanceof Date) {
      return dateField;
    } else if (
      typeof dateField === "string" &&
      dateField &&
      dateField !== "__"
    ) {
      try {
        return new Date(dateField);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const statusOptions = ["pending", "in progress", "completed", "delayed"];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
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
            Edit Project Timeline
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{ backgroundColor: theme.palette.background.paper, pt: 3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Timeline Items
              </Typography>
            </Grid>

            {formData.timeline_data_dict_list.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    alignItems="center"
                  >
                    {/* Process Step - Read Only */}
                    <Grid item xs={12} md={3}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Process Step
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {item["Process Step"]}
                      </Typography>
                    </Grid>

                    {/* Owner - Read Only */}
                    <Grid item xs={12} md={3}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Owner
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {item["Owner"]}
                      </Typography>
                    </Grid>

                    {/* Due Date - Editable */}
                    <Grid item xs={12} md={3}>
                      <DatePicker
                        label="Due Date"
                        value={parseDate(item["Due Date"])}
                        onChange={(date) => handleDateChange(index, date)}
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: theme.palette.chat_input.text_box,
                          },
                        }}
                      />
                    </Grid>

                    {/* Status - Editable */}
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={item["Status"]}
                          label="Status"
                          onChange={(e) =>
                            handleStatusChange(index, e.target.value)
                          }
                          sx={{
                            backgroundColor: theme.palette.chat_input.text_box,
                          }}
                        >
                          {statusOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{ px: 3, pb: 3, backgroundColor: theme.palette.background.paper }}
        >
          <Button
            onClick={onClose}
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TimelineEditForm;
