import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface TotalResultProps {
    searchQuery: string;
}

const TotalResult: React.FC<TotalResultProps> = ({ searchQuery }) => {
    const searchResults = useSelector((state: RootState) => state.totalSearch.searchResults);

    useEffect(() => {
        console.log('searchResults in TotalResult:', searchResults);
    }, [searchResults]);

    const {
        chat_results = [],
        video_results = [],
        community_results = [],
        document_results = []
    } = searchResults || {};

    return (
        <div>
            <h2>검색 결과: {searchQuery}</h2>

            <div>
                <h3>채팅 결과</h3>
                {chat_results.length > 0 ? (
                    chat_results.map((result: any, index: number) => (
                        <div key={index}>
                            <strong>질문:</strong> {result.query}<br />
                            <strong>답변:</strong> {result.answer}
                        </div>
                    ))
                ) : (
                    <p>채팅 결과가 없습니다.</p>
                )}
            </div>

            <div>
                <h3>비디오 결과</h3>
                {video_results.length > 0 ? (
                    video_results.map((result: any, index: number) => (
                        <div key={index}>
                            <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
                        </div>
                    ))
                ) : (
                    <p>비디오 결과가 없습니다.</p>
                )}
            </div>

            <div>
                <h3>커뮤니티 결과</h3>
                {community_results.length > 0 ? (
                    community_results.map((result: any, index: number) => (
                        <div key={index}>
                            <strong>{result.title}</strong><br />
                            <p>{result.board_contents}</p>
                        </div>
                    ))
                ) : (
                    <p>커뮤니티 결과가 없습니다.</p>
                )}
            </div>

            <div>
                <h3>문서 결과</h3>
                {document_results.length > 0 ? (
                    document_results.map((result: any, index: number) => (
                        <div key={index}>
                            <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
                        </div>
                    ))
                ) : (
                    <p>문서 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default TotalResult;