import React from "react";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SimpleDialogDemo from "./Dialog";
import { Posts, Users } from "../../../types";

interface ActionsRendererProps {
  value: Posts;
  edited: boolean;
  deleted: boolean;
  setEdited: (arg: boolean) => void;
  setDeleted: (arg: boolean) => void;
}

const ActionsRenderer: React.FC<ActionsRendererProps> = ({
  value,
  edited,
  deleted,
  setEdited,
  setDeleted,
}) => {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<EditIcon />}
        style={{ color: "blue", background: "none", border: "none" }}></Button>
      <Button
        onClick={() => setOpen2(true)}
        startIcon={<DeleteIcon />}
        style={{ color: "red", background: "none", border: "none" }}></Button>
      <div>
        <SimpleDialogDemo
          edited={edited}
          deleted={deleted}
          setEdited={setEdited}
          setDeleted={setDeleted}
          ToDelete={false}
          open={open}
          setOpen={setOpen}
          data={value}
        />
      </div>
      <div>
        <SimpleDialogDemo
          edited={edited}
          deleted={deleted}
          setEdited={setEdited}
          setDeleted={setDeleted}
          ToDelete
          open={open2}
          setOpen={setOpen2}
          data={value}
        />
      </div>
    </div>
  );
};

export default ActionsRenderer;
