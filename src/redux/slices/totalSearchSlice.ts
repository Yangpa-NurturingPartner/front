import { createSlice } from '@reduxjs/toolkit';

type GetTotalSearchResultPropsType = {
  results: []
};

const initialState: GetTotalSearchResultPropsType = {
  results: []
};

const totalSearchSlice = createSlice({
  name: 'totalSearch',
  initialState,
  reducers: {
    fetchTotalSearchResult: (state, action) => {
      state.results = action.payload;
    }
  }
});

export const { fetchTotalSearchResult } = totalSearchSlice.actions;
export default totalSearchSlice.reducer;