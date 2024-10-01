import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../modules/Totalsearchmodule"; // RootState 타입을 가져옵니다.

interface SearchResult {
    title?: string;
    message?: string;
}

const TotalResult: React.FC = () => {

    const totalSearchResult = useSelector((state: RootState) => state.totalSearchResult) || {
        video_results: [] as SearchResult[],
        document_results: [] as SearchResult[],
        community_results: [] as SearchResult[],
        chat_results: [] as SearchResult[]
    };

    return (
        <div>
            <h2>검색 결과</h2>
            <div>
                <h3>비디오 결과</h3>
                {totalSearchResult.video_results.length > 0 ? (
                    totalSearchResult.video_results.map((result: SearchResult, index: number) => (
                        <div key={index}>{result.title}</div>
                    ))
                ) : (
                    <p>비디오 결과가 없습니다.</p>
                )}
            </div>
            <div>
                <h3>문서 결과</h3>
                {totalSearchResult.document_results.length > 0 ? (
                    totalSearchResult.document_results.map((result: SearchResult, index: number) => (
                        <div key={index}>{result.title}</div>
                    ))
                ) : (
                    <p>문서 결과가 없습니다.</p>
                )}
            </div>
            <div>
                <h3>커뮤니티 결과</h3>
                {totalSearchResult.community_results.length > 0 ? (
                    totalSearchResult.community_results.map((result: SearchResult, index: number) => (
                        <div key={index}>{result.title}</div>
                    ))
                ) : (
                    <p>커뮤니티 결과가 없습니다.</p>
                )}
            </div>
            <div>
                <h3>채팅 결과</h3>
                {totalSearchResult.chat_results.length > 0 ? (
                    totalSearchResult.chat_results.map((result: SearchResult, index: number) => (
                        <div key={index}>{result.message}</div>
                    ))
                ) : (
                    <p>채팅 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default TotalResult;