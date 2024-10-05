import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface TotalResultProps {
    searchQuery: string;
    isLoading: boolean;  // isLoading prop 추가
}

const TotalResult: React.FC<TotalResultProps> = ({ searchQuery, isLoading }) => {
    const searchResults = useSelector((state: RootState) => state.totalSearch.searchResults);

    const {
        chat_results = [],
        video_results = [],
        community_results = [],
        document_results = []
    } = searchResults || {};

    const ResultSection = ({ title, results }: { title: string, results: any[] }) => {
        if (results.length === 0) return null; // 결과가 없으면 null 반환

        return (
            <div style={{ width: '48%', margin: '1%' }}>
                <h3>{title}</h3>
                {results.map((result: any, index: number) => (
                    <div key={index} style={{
                        backgroundColor: '#E6F3FF',
                        borderRadius: '15px',
                        padding: '10px',
                        marginBottom: '10px'
                    }}>
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                            {result.title}
                        </a>
                    </div>
                ))}
            </div>
        );
    };

    const hasResults = chat_results.length > 0 || video_results.length > 0 || 
                       community_results.length > 0 || document_results.length > 0;

    return (
        <div style={{ textAlign: 'center' }}> {/* 중앙 정렬을 위한 스타일 추가 */}
            <h2>검색 : {searchQuery}</h2>

            {isLoading ? (
                <div style={{ padding: '20px' }}>
                    <h2>검색중입니다.</h2>
                </div>
            ) : hasResults ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}> {/* 중앙 정렬을 위한 스타일 수정 */}
                    <ResultSection title="관련 문서" results={document_results} />
                    <ResultSection title="관련 영상" results={video_results} />
                    <ResultSection title="커뮤니티" results={community_results} />
                    <ResultSection title="예전 채팅" results={chat_results} />
                </div>
            ) : (
                <div style={{ padding: '20px' }}>
                    <h2>검색 결과가 없습니다.</h2>
                </div>
            )}
        </div>
    );
}

export default TotalResult;