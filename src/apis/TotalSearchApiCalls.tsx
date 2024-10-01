import axios from "axios";
import { GET_TOTAL_SEARCH_RESULT } from "../modules/TotalSearchModule";

export const getTotalSearchResult = (searchQuery: string) => {
    return async (dispatch: any) => {
        try {
            const response = await axios.get(`http://192.168.0.218:9000/search/unified?query=${searchQuery}`);
            dispatch({
                type: GET_TOTAL_SEARCH_RESULT, // 액션 타입
                payload: response.data // API 응답 데이터
            });
        } catch (error) {
            console.error('API 호출 에러:', error);
            dispatch({
                type: 'API_CALL_ERROR', // 에러 액션 타입
                payload: (error as Error).message // 에러 메시지
            });
        }
    };
};
