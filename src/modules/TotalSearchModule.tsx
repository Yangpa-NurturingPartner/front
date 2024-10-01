import { handleActions, Action, } from 'redux-actions';
import { combineReducers } from 'redux';
// 결과 항목 정의
interface VideoResult {
video_no: number;
}
  
interface DocumentResult {
document_no: number;
}

interface CommunityResult {
board_no: number;
}

interface ChatResult {
session_id: string;
}
  
// 전체 항목 정의
type GetTotalSearchResultPropsType = {
    results: {
      video_results: VideoResult[];
      document_results: DocumentResult[];
      community_results: CommunityResult[];
      chat_results: ChatResult[];
    };
  }
  
// 초기 상태 정의
const initialState: GetTotalSearchResultPropsType = {
    results: {
        video_results: [],
        document_results: [],
        community_results: [],
        chat_results: []
    }
};
  
export const GET_TOTAL_SEARCH_RESULT = "get_total_search_result" as const;

export function getTotalSearchResult(payload: GetTotalSearchResultPropsType['results']): {
  type: typeof GET_TOTAL_SEARCH_RESULT;
  payload: GetTotalSearchResultPropsType['results'];
} {
  return {
    type: GET_TOTAL_SEARCH_RESULT,
    payload,
  };
}

const totalSearchReducer = handleActions<GetTotalSearchResultPropsType, GetTotalSearchResultPropsType['results']>({
    [GET_TOTAL_SEARCH_RESULT]: (state, { payload }: Action<GetTotalSearchResultPropsType['results']>) => ({
      ...state,
      results: payload
    })
  }, initialState);

const rootReducer = combineReducers({
    totalSearchReducer
})

export default rootReducer;