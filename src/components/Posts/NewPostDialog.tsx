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
import MultipleChoose from "./MultipleChoose";
import { Tag } from "../Tags/Tags";
import ChooseOne from "./ChooseOne";

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
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
    setFormSubmitted(true);
    if (selectedTags.length === 0 || !selectedUser) {
      return;
    } else {
      try {
        const tagIds = selectedTags.map((tag) => tag.id);
        const response = await axios.post("https://localhost:5001/api/Posts", {
          title: data.title,
          description: data.description,
          userId: selectedUser?.id,
          tagIds: tagIds,
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
          toast.error(`Error Creating: ${error.message}`);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    }
  };

  const body = (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        {...register("title", { required: true })}
        error={Boolean(errors.title)}
        helperText={errors.title ? "title is required" : ""}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        {...register("description", { required: true })}
        error={Boolean(errors.description)}
        helperText={errors.description ? "Description is required" : ""}
      />
      <ChooseOne
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      {formSubmitted && !selectedUser && (
        <span style={{ color: "red", marginTop: "4px" }}>User is required</span>
      )}
      <MultipleChoose
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      {formSubmitted && selectedTags.length === 0 && (
        <span style={{ color: "red", marginTop: "4px" }}>
          Please select at least one tag.
        </span>
      )}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </StyledForm>
  );

  return (
    <div className="p-5" style={{ padding: "10px" }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Post
      </Button>
      <StyledDialog onClose={handleClose} open={open}>
        <DialogTitle>Add New Post</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>{body}</ListItem>
        </List>
      </StyledDialog>
    </div>
  );
}
