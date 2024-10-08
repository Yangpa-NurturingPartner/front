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

    const Tooltip = ({ text }: { text: string }) => (
        <div style={{
            position: 'absolute',
            backgroundColor: 'black',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            top: '-30px', // Tooltip 위치 조정
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 1,
            transition: 'opacity 0.1s ease-in' // 빠른 전환
        }}>
            {text}
        </div>
    );

    const ResultItem: React.FC<{ result: any, isCommunity?: boolean, isChat?: boolean }> = ({ result, isCommunity = false, isChat = false }) => {
        const [showTooltip, setShowTooltip] = React.useState(false);

        const handleMouseEnter = () => {
            setShowTooltip(true);
        };


        const handleMouseLeave = () => {
            setShowTooltip(false);
        };

        const getHref = () => {
            if (isCommunity) {
                return `/community/${result.board_no}`;
            } else if (isChat) {
                // 여기를 수정합니다
                return `/chat?session_id=${result.session_id}`;
            } else {
                return result.url;
            }
        };

        const getTooltipText = () => {
            if (isCommunity) {
                return "해당 페이지로 이동";
            } else if (isChat) {
                return "채팅 기록 보기";
            } else {
                return "해당 페이지로 이동";
            }
        };

        const displayText = isCommunity ? result.title : isChat ? result.summ_answer : result.title;

        return (
            <div style={{
                backgroundColor: '#E6F3FF',
                borderRadius: '15px',
                padding: '10px',
                marginBottom: '10px',
                position: 'relative'
            }}>
                <a
                    href={getHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ position: 'relative', textDecoration: 'none', color: 'inherit' }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {displayText}
                    {showTooltip && <Tooltip text={getTooltipText()} />}
                </a>
            </div>
        );
    };

    const ResultSection = ({ title, results, isCommunity = false, isChat = false }: { title: string, results: any[], isCommunity?: boolean, isChat?: boolean }) => {
        return (
            <div style={{ width: '48%', margin: '1%' }}>
                <h3>{title}</h3>
                {results.length > 0 ? (
                    results.map((result: any, index: number) => (
                        <ResultItem key={index} result={result} isCommunity={isCommunity} isChat={isChat} />
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
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <img src="/img/LoagingRolling.gif" alt="로딩 중" style={{ width: '100px', height: '100px' }} />
                </div>
            ) : hasResults ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    <ResultSection title="관련 문서" results={document_results} />
                    <ResultSection title="관련 영상" results={video_results} />
                    <ResultSection title="커뮤니티" results={community_results} isCommunity={true} />
                    <ResultSection title="예전 채팅" results={chat_results} isChat={true} />
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