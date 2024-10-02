import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";

export const useCommunity = (boardId?: number) => {
    // 목록 데이터
    const [communityData, setCommunityData] = useState<any[]>([]);
    // 로딩
    const [loading, setLoading] = useState<boolean>(true);
    // 에러 문구
    const [error, setError] = useState<string | null>(null);
    // 페이지 총 수
    const [pageCount, setPageCount] = useState<number>(0);
    // 선택한 페이지
    const [selectedPage, setSelectedPage] = useState<number>(1);
    // 선텍한 목록
    const [selectedList, setSelectedList] = useState<number>(0);
    // 검색 기간 선택
    const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all');

    const serverIp: string | undefined = process.env.REACT_APP_HOST;
    const port: string | undefined = process.env.REACT_APP_BACK_PORT;

    // 데이터를 가져오는 함수
    const fetchCommunityData = async () => {
        try {
            setLoading(true);
            setError(null);

            let response: AxiosResponse<any, any>;
            if (boardId) {
                // 특정 ID의 게시물을 가져오는 요청
                response = await axios.get(`http://${serverIp}:${port}/community/${boardId}`);
                const res = response.data.data;
                setCommunityData(res); // 상세 게시물 데이터 저장
            } else {
                // 전체 게시물 목록을 가져오는 기존 요청
                response = await axios.post(`http://${serverIp}:${port}/community/boards`, {
                    boardCode: selectedList,
                    pageNo: selectedPage,
                    size: 10,
                });
                const res = response.data.data;
                setCommunityData(res.list);
                setPageCount(res.end);
            }
            setLoading(false);
        } catch (err: unknown) {
            setError("커뮤니티 게시물을 가져오는데 실패했습니다");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunityData(); // 컴포넌트 마운트 시 데이터 가져오기
    }, [selectedPage, selectedList, boardId]);


    // 사용자 쿼리에 따른 게시물 가져오는 함수
    const searchUserQuery = async (query: string) => {
        try {
            setLoading(true);
            setError(null); // 에러 초기화

            // 빈 검색어인 경우 기본 게시물 목록을 가져옴
            if (!query.trim()) {
                // 빈 검색어일 때는 페이지 번호와 게시판 코드를 초기화
                const response: AxiosResponse<any, any> = await axios.post(`http://${serverIp}:${port}/community/boards`, {
                    boardCode: 0,
                    pageNo: 1,
                    size: 10,
                });
                const res = response.data.data;
                setCommunityData(res.list);
                setPageCount(res.end);
            } else {
                // 검색어가 있는 경우에는 검색 API 호출
                const response: AxiosResponse<any, any> = await axios.post(`http://${serverIp}:${port}/community/boards/search`, {
                    query: query,
                    period: selectedPeriod
                });
                const res = response.data.data;
                setCommunityData(res.list);
                setPageCount(res.end);
            }
        } catch (err) {
            setError("커뮤니티 게시물을 가져오는데 실패했습니다");
        } finally {
            setLoading(false);
        }
    };

    return {
        communityData, loading, error,
        pageCount, selectedPage, setSelectedPage,
        selectedList, setSelectedList,
        selectedPeriod, setSelectedPeriod,
        searchUserQuery, fetchCommunityData
    };
};