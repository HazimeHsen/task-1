import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { styled } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { Users } from "../../../types";

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
  data: Users;
  open: boolean;
  ToDelete: boolean;
  setOpen: (arg: boolean) => void;
  edited: boolean;
  deleted: boolean;
  setEdited: (arg: boolean) => void;
  setDeleted: (arg: boolean) => void;
}) {
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

  const onSubmit = async (data: Users) => {
    console.log(data);
    try {
      const response = await axios.put("https://localhost:5001/api/Users", {
        id: data.id,
        name: data.username,
        email: data.email,
        postIds: data.posts.map((post) => post.id),
      });
      if (response.data) {
        toast.success(response.data.message);
        handleClose();
        setEdited(!edited);
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

  const handleDelete = async () => {
    try {
      await axios.delete(`https://localhost:5001/api/Users`, {
        data: {
          id: data.id,
        },
      });
      setDeleted(!deleted);
      toast.success("Delete successful");
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
        label="Name"
        variant="outlined"
        fullWidth
        {...register("username", { required: true })}
        error={Boolean(errors.username)}
        helperText={errors.username ? "Name is required" : ""}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        {...register("email", {
          required: true,
          pattern: /^\S+@\S+$/i,
        })}
        error={Boolean(errors.email)}
        helperText={errors.email ? "Valid email is required" : ""}
      />
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
