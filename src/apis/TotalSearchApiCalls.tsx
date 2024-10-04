// src/apis/TotalSearchApiCalls.tsx

import axios from "axios";
import { fetchTotalSearchResult, startSearch } from "../redux/slices/totalSearchSlice";

// 하드코딩된 토큰 (실험용)
const hardcodedToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJqYW5naGV5amlAZ21haWwuY29tIiwibmFtZSI6Iuyepe2YnOyngCIsImlhdCI6MTcyNzg1ODU1OX0.stK1UATn86vfnv6i3JTF45sk1QPnI1hm54YZ0v99vfk";

// searchQuery와 하드코딩된 토큰을 받아 백엔드에 요청하는 함수
export const totalSearchResult = (searchQuery: string) => {
    return async (dispatch: any) => {
        dispatch(startSearch()); // 검색 시작 시 로딩 상태 설정 및 이전 결과 초기화
        try {
            // 요청 데이터 생성 (검색어와 하드코딩된 토큰 포함)
            const requestData = {
                search: searchQuery,
                token: "Bearer " + hardcodedToken // 하드코딩된 토큰 사용
            };

            // 백엔드에 POST 요청 전송
            const serverIp: string | undefined = process.env.REACT_APP_HOST;
            const port: string | undefined = process.env.REACT_APP_BACK_PORT;
            const url = `http://${serverIp}:${port}/search/total`;
            console.log("Request URL:", url); // URL 로그 출력
            console.log("Request Data:", requestData); // 요청 데이터 로그 출력

            const response = await axios.post(url, requestData);
            console.log("Response Data:", response.data); // 응답 데이터 로그 출력

            // 응답 데이터 구조 확인 및 디스패치
            if (response.data.status === "success" && response.data.data) {
                dispatch(fetchTotalSearchResult(response.data.data));
            } else {
                console.error("Unexpected response structure:", response.data);
                dispatch(fetchTotalSearchResult({
                    chat_results: [],
                    video_results: [],
                    community_results: [],
                    document_results: []
                }));
            }

        } catch (error) {
            console.error("Error fetching search results:", error);
            dispatch(fetchTotalSearchResult({
                chat_results: [],
                video_results: [],
                community_results: [],
                document_results: []
            }));
            // 에러 처리 추가
            if (axios.isAxiosError(error)) {
                // Axios 에러 처리
                console.error("Axios error:", error.response?.data);
            } else {
                // 일반 에러 처리
                console.error("Unexpected error:", error);
            }
        }
    };
};