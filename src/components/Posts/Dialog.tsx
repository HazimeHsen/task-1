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
import { Posts } from "../../../types";
import MultipleChoose from "./MultipleChoose";
import { useEffect, useState } from "react";
import { Tag } from "../Tags/Tags";

const DeleteConfirmationContainer = styled("div")({
  textAlign: "center",
  padding: "20px",
});

const DeleteText = styled("div")({
  marginBottom: "16px",
});

const DeleteButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "100%",
});

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.getContrastText(theme.palette.error.main),
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
  width: "100%",
}));

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

export default function SimpleDialogDemo({
  data,
  open,
  setOpen,
  ToDelete,
  edited,
  deleted,
  setEdited,
  setDeleted,
}: {
  data: Posts;
  open: boolean;
  ToDelete: boolean;
  setOpen: (arg: boolean) => void;
  edited: boolean;
  deleted: boolean;
  setEdited: (arg: boolean) => void;
  setDeleted: (arg: boolean) => void;
}) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
  } = useForm({
    defaultValues: data,
  });

  const isErrorResponse = (error: unknown): error is Error => {
    return error instanceof Error && typeof error.message === "string";
  };

  const onSubmit = async (data: FieldValues) => {
    setFormSubmitted(true);
    if (selectedTags.length === 0) {
      return;
    } else {
      try {
        const tagIds = selectedTags.map((tag) => tag.id);
        const response = await axios.put("https://localhost:5001/api/Posts", {
          id: data.id,
          title: data.title,
          description: data.description,
          tagIds: tagIds,
        });
        if (response.data) {
          setEdited(!edited);
          toast.success(response.data.message);
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

  const handleDelete = async () => {
    try {
      await axios.delete(`https://localhost:5001/api/Posts`, {
        data: {
          id: data.id,
        },
      });
      setDeleted(!deleted);
      toast.success("Delete successfull");
    } catch (error) {
      if (isErrorResponse(error)) {
        toast.error(`Error deleting: ${error.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const body = ToDelete ? (
    <DeleteConfirmationContainer>
      <DeleteText>Are you sure you want to delete this user?</DeleteText>
      <DeleteButtonContainer>
        <DeleteButton variant="contained" onClick={handleDelete}>
          Delete
        </DeleteButton>
      </DeleteButtonContainer>
    </DeleteConfirmationContainer>
  ) : (
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
      <MultipleChoose
        DefaultTagsIds={data.tagIds}
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
        {ToDelete ? "Delete User" : "Edit User"}
      </Button>
      <StyledDialog onClose={handleClose} open={open}>
        <DialogTitle>{ToDelete ? "Delete User" : "Edit User"}</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>{body}</ListItem>
        </List>
      </StyledDialog>
    </div>
  );
}
