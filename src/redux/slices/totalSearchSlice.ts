import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchResult {
  chat_results: any[];
  video_results: any[];
  community_results: any[];
  document_results: any[];
}

interface TotalSearchState {
  searchResults: SearchResult;
  isLoading: boolean;
}

const initialState: TotalSearchState = {
  searchResults: {
    chat_results: [],
    video_results: [],
    community_results: [],
    document_results: []
  },
  isLoading: false
};

const totalSearchSlice = createSlice({
  name: 'totalSearch',
  initialState,
  reducers: {
    startSearch: (state) => {
      state.isLoading = true;
      state.searchResults = initialState.searchResults; // 결과 초기화
    },
    fetchTotalSearchResult: (state, action: PayloadAction<SearchResult>) => {
      state.searchResults = action.payload;
      state.isLoading = false;
    },
    clearSearchResults: (state) => {
      state.searchResults = initialState.searchResults;
      state.isLoading = false;
    }
  }
});

export const { startSearch, fetchTotalSearchResult, clearSearchResults } = totalSearchSlice.actions;
export default totalSearchSlice.reducer;