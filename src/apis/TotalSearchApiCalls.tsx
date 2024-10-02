import axios from "axios";
import { fetchTotalSearchResult } from "../redux/slices/totalSearchSlice"; // 수정된 부분

export const totalSearchResult = (searchQuery: string) => {
    return async (dispatch: any) => {
        try {
            const response = await axios.get("http://192.168.0.218:9000/search/unified");
            dispatch(fetchTotalSearchResult(response.data));
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };
};
