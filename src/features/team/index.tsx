/* eslint-disable react-hooks/exhaustive-deps */
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../shared/component/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchTeamData, setFetchedInitialData, resetTeam, setSortItem } from "./teamSlice";
import { useEffect } from "react";
import { DataGrid, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { setPageSize, setPageNumber } from "../team/teamSlice";
import { GridOverlay } from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";
import { withSnackbar } from "../../core/WithSnackbar";

const CustomLoadingOverlay = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <GridOverlay>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress sx={{ color: colors.greenAccent[300] }} />
      </Box>
    </GridOverlay>
  );
};

const Team = (props: { snackbarShowMessage: any; }) => {
  const { snackbarShowMessage } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch<AppDispatch>();

  const teamData = useSelector((state: RootState) => state.team.data);
  const pageNumber = useSelector((state: RootState) => state.team.pageNumber);
  const pageSize = useSelector((state: RootState) => state.team.pageSize);
  const sortItem = useSelector((state: RootState) => state.team.sortItem);
  const totalRowCount = useSelector(
    (state: RootState) => state.team.totalCount
  );
  const loading = useSelector((state: RootState) => state.team.loading);
  const init = useSelector((state: RootState) => state.team.init);
  const error = useSelector((state: RootState) => state.team.error);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
  ];

  // Reset the state when the component is unmounted
  useEffect(() => {
    return () => {
      dispatch(resetTeam());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      snackbarShowMessage(`Error: ${error}`, "error");
    }
  }, [error]);

  useEffect(() => {
    if (!init) {
      dispatch(setFetchedInitialData());
    } else {
      dispatch(fetchTeamData({ pageNumber, pageSize, sortItem }));
    }
  }, [dispatch, pageNumber, pageSize,sortItem, init]);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page !== pageNumber - 1) {
      dispatch(setPageNumber(model.page + 1));
    }
    if (model.pageSize !== pageSize) {
      dispatch(setPageSize(model.pageSize));
    }
  };

  const handleSortModelChange = (model: GridSortModel) => {
    dispatch(setSortItem(model[0]));
  };

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={teamData}
          columns={columns}
          components={{ LoadingOverlay: CustomLoadingOverlay }}
          rowCount={totalRowCount}
          paginationMode="server"
          sortingMode="server"
          loading={loading}
          initialState={{
            sorting:{

            },
            pagination: {
              paginationModel: {
                page: pageNumber - 1,
                pageSize: pageSize,
              },
            },
          }}
          onPaginationModelChange={handlePaginationModelChange}
          onSortModelChange={handleSortModelChange}
          pageSizeOptions={[10, 25, 50]}
          keepNonExistentRowsSelected
        ></DataGrid>
      </Box>
    </Box>
  );
};

export default withSnackbar(Team);
