// src/features/team/teamSlice.ts
import { GridSortItem } from "@mui/x-data-grid/models";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ReviewerData } from "../../shared/model/reviewerData";
import { RowData } from "../../shared/model/rowData";

interface TeamState {
  init: boolean;
  data: RowData[];
  sortItem: GridSortItem | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  
}

interface JsonResponse {
  totalCount: number;
  status: {
    success: boolean;
    message: string;
  };
  value: ReviewerData[];
}

const initialState: TeamState = {
  init: false,
  data: [],
  sortItem: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const fetchTeamData = createAsyncThunk(
  "team/fetchTeamData",
  async (params: { pageNumber: number; pageSize: number; sortItem: GridSortItem | null}) => {
    try {
      let url = `https://localhost:7046/api/Reviewer?pageNo=${params.pageNumber}&pageSize=${params.pageSize}`
      if(params.sortItem){
        url = url + `&sortColumn=${params.sortItem.field === 'name' ? 'FirstName': capitalizeFirstLetter(params.sortItem.field)}&sortOrder=${params.sortItem.sort}`
      }
      const response = await axios.get<JsonResponse>( url );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    resetTeam: (state) => {
      state.init = false;
      state.data = [];
      state.pageNumber = 1;
      state.pageSize = 10;
      state.loading = false;
      state.error = null;
    },
    setFetchedInitialData: (state) => {
      state.init = true;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setSortItem: (state, action: PayloadAction<GridSortItem>) => {
      state.sortItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTeamData.fulfilled,
        (state, action: PayloadAction<JsonResponse>) => {
          state.data = action.payload.value.map((r: ReviewerData) => {
            return {
              id: r.id,
              name: r.firstName + " " + r.lastName,
            };
          });
          state.totalCount = action.payload.totalCount;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchTeamData.rejected, (state, action) => {
        state.loading = false;
        state.totalCount = 0;
        state.error =
          action.error.message || "An error occurred while fetching data";
      });
  },
});

export const { setPageSize, setPageNumber, setFetchedInitialData, resetTeam, setSortItem } =
  teamSlice.actions;

export default teamSlice.reducer;
