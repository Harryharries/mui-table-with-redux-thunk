import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import teamReducer from "../features/team/teamSlice";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: {
    team: teamReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;