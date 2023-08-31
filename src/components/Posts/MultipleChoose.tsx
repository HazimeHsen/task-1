import * as React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Tag } from "../Tags/Tags";
import axios from "axios";

export default function MultipleChoose({
  DefaultTagsIds,
  selectedTags,
  setSelectedTags,
}: {
  DefaultTagsIds?: number[];
  selectedTags: Tag[];
  setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}) {
  const [rowData, setRowData] = React.useState<Tag[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      const response = await axios.get<Tag[]>(
        "https://localhost:5001/api/Tags"
      );
      const filteredTags = response.data.filter((tag) =>
        DefaultTagsIds?.includes(tag.id)
      );
      setRowData(response.data);
      setSelectedTags(filteredTags);
    };
    getData();
  }, [DefaultTagsIds, setSelectedTags]);

  const handleTagSelection = (event: any, value: any) => {
    setSelectedTags(value);
  };

  return (
    <Stack spacing={2} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="size-small-filled-multi"
        size="small"
        options={rowData}
        getOptionLabel={(option) => option.name}
        onChange={handleTagSelection}
        value={selectedTags}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.name}
              size="small"
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Tags"
            placeholder="Tags"
          />
        )}
      />
    </Stack>
  );
}
