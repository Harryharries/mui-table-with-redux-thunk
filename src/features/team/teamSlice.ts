// src/features/team/teamSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../redux/store";
import { RowData } from "../../shared/model/rowData";

interface TeamState {
  data: RowData[];
  pageNumber: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  data: [],
  pageNumber: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    fetchDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state, action: PayloadAction<RowData[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
  },
});

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  setPageSize,
  setPageNumber,
} = teamSlice.actions;

export const fetchTeamData = (
  pageNo: number,
  pageSize: number
): AppThunk => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await fetch(
      `https://localhost:7046/api/Reviewer?pageNo=${pageNo}&pageSize=${pageSize}`
    );
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    const data: RowData[] = await response.json();
    dispatch(fetchDataSuccess(data));
  } catch (error: any) {
    dispatch(fetchDataFailure(error.message));
  }
};

export default teamSlice.reducer;
