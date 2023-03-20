import React, { ChangeEvent, useState, KeyboardEvent, useEffect } from "react";
import { Box, TextField, useTheme, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import { RowDataFilter } from "../../shared/model/rowDataFiliter";

interface FilterComponentProps {
  filter: RowDataFilter | null;
  onFilterChange: (filters: RowDataFilter) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filter,
  onFilterChange,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [idFilter, setIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    if (filter) {
      setIdFilter(filter.id);
      setNameFilter(filter.name);
    } else {
      setIdFilter("");
      setNameFilter("");
    }
  }, [filter]);

  const handleClearFilter = () => {
    if (idFilter !== "" || nameFilter !== "") {
      setIdFilter("");
      setNameFilter("");
      onFilterChange({ id: "", name: "" });
    }
  };

  const handleSearch = () => {
    onFilterChange({ id: idFilter, name: nameFilter });
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="start"
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: colors.blueAccent[400],
          },
          "&:hover fieldset": {
            borderColor: colors.blueAccent[200],
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.blueAccent[500],
          },
        },
        "& .MuiInputLabel-outlined": {
          color: colors.blueAccent[200],
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: colors.blueAccent[500],
        },
      }}
      mb={2}
      gap="10px"
    >
      <TextField
        label="Filter by ID"
        variant="outlined"
        size="small"
        value={idFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setIdFilter(e.target.value)
        }
        onKeyPress={handleKeyPress}
      />
      <TextField
        label="Filter by Name"
        variant="outlined"
        size="small"
        value={nameFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNameFilter(e.target.value)
        }
        onKeyPress={handleKeyPress}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        style={{ backgroundColor: colors.greenAccent[600] }}
      >
        Search
      </Button>
      <IconButton
        style={{ color: colors.grey[200] }}
        aria-label="clear filter"
        onClick={handleClearFilter}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default FilterComponent;
