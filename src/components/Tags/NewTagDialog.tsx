import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import { FieldValues, useForm } from "react-hook-form";
import { styled } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { Users } from "../../../types";
import { useState } from "react";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    minWidth: "300px",
  },
}));

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
  padding: "16px",
});

export default function NewTagDialog({
  create,
  setCreate,
}: {
  create: boolean;
  setCreate: (arg: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isErrorResponse = (error: unknown): error is Error => {
    return error instanceof Error && typeof error.message === "string";
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await axios.post("https://localhost:5001/api/Tags", {
        name: data.name,
      });
      if (response.data) {
        toast.success(response.data.message);
        setCreate(!create);
        handleClose();
      }
      if (response.data.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        toast.error(`Error Editing: ${error.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const body = (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        {...register("name", { required: true })}
        error={Boolean(errors.name)}
        helperText={errors.name ? "Name is required" : ""}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </StyledForm>
  );

  return (
    <div className="p-5" style={{ padding: "10px" }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Tag
      </Button>
      <StyledDialog onClose={handleClose} open={open}>
        <DialogTitle>Add New Tag</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>{body}</ListItem>
        </List>
      </StyledDialog>
    </div>
  );
}
