import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Users } from "../../../types";
import axios from "axios";

export default function ChooseOne({
  selectedUser,
  setSelectedUser,
}: {
  selectedUser: Users | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<Users | null>>;
}) {
  const [rowData, setRowData] = React.useState<Users[]>([]);
  console.log(selectedUser);
  React.useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get<Users[]>(
        "https://localhost:5001/api/Users"
      );
      setRowData(data);
    };
    getData();
  }, []);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={rowData}
      getOptionLabel={(option) => option.username}
      value={selectedUser}
      onChange={(event, newValue: any) => {
        setSelectedUser(newValue);
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
}
