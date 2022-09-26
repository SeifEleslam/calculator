import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface state {
  digits: string[];
  ops: string[];
  results: number | undefined;
  curr: number;
  count: number;
  startLevelIndex: number[];
  endLevelIndex: number[];
  percentLevel: number[];
}
interface payload {
  statePayload: state;
  showedPayload: string;
}
export interface histState {
  histList: state[];
  showed: string[];
}

const initialState: histState = {
  histList: [],
  showed: [],
};

export const histSlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<payload>) => {
      state.histList = [...state.histList, action.payload.statePayload];
      state.showed = [...state.showed, action.payload.showedPayload];
    },
    clear: (state) => {
      state.histList = [];
      state.showed = [];
    },
  },
});

export const selectHist = (state: RootState) => state.history;
export const { add, clear } = histSlice.actions;
export default histSlice.reducer;
