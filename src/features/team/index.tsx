import { Box } from "@mui/material";

const Team = () => {

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiCheckbox-root": {
            color: `${'#b7ebde'} !important`,
          },
        }}
      >
      </Box>
    </Box>
  );

};

export default Team;
