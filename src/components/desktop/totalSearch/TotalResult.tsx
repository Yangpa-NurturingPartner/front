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

    const ResultSection = ({ title, results, isCommunity = false }: { title: string, results: any[], isCommunity?: boolean }) => {
        return (
            <div style={{ width: '48%', margin: '1%' }}>
                <h3>{title}</h3>
                {results.length > 0 ? (
                    results.map((result: any, index: number) => (
                        <div key={index} style={{
                            backgroundColor: '#E6F3FF',
                            borderRadius: '15px',
                            padding: '10px',
                            marginBottom: '10px'
                        }}>
                            {result.title} : {/* 공백 추가 */}
                            {isCommunity ? (
                                <a href={`/community/${result.board_no}`} target="_blank" rel="noopener noreferrer">
                                    해당 링크로 이동
                                </a>
                            ) : (
                                <a href={result.url} target="_blank" rel="noopener noreferrer">
                                    해당 링크로 이동
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{
                        backgroundColor: '#E6F3FF',
                        borderRadius: '15px',
                        padding: '10px',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0 }}>검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>
        );
    };

    const hasResults = chat_results.length > 0 || video_results.length > 0 || 
                       community_results.length > 0 || document_results.length > 0;

    return (
        <div>
            <h2>검색 결과: {searchQuery}</h2>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <img src="/img/LoagingRolling.gif" alt="로딩 중" style={{ width: '100px', height: '100px' }} />
                </div>
            ) : hasResults ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    <ResultSection title="관련 문서" results={document_results} />
                    <ResultSection title="관련 영상" results={video_results} />
                    <ResultSection title="커뮤니티" results={community_results} isCommunity={true} />
                    <ResultSection title="예전 채팅" results={chat_results} />
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h3>검색 결과가 없습니다.</h3>
                </div>
            )}
        </div>
    );
}

export default TotalResult;