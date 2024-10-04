import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchResult {
  chat_results: any[];
  video_results: any[];
  community_results: any[];
  document_results: any[];
}

interface TotalSearchState {
  searchResults: SearchResult;
}

const initialState: TotalSearchState = {
  searchResults: {
    chat_results: [],
    video_results: [],
    community_results: [],
    document_results: []
  }
};

const totalSearchSlice = createSlice({
  name: 'totalSearch',
  initialState,
  reducers: {
    fetchTotalSearchResult: (state, action: PayloadAction<SearchResult>) => {
      state.searchResults = action.payload;
    }
  }
});

export const { fetchTotalSearchResult } = totalSearchSlice.actions;
export default totalSearchSlice.reducer;