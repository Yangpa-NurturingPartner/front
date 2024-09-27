import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SearchPart from "../components/desktop/main/SearchPart";
import "../css/mainCsss.scss";
import SearchNavigate from "../components/desktop/main/SearchNavigate";
import axios from "axios";

const Main: React.FC = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [query, setQuery] = useState<string>(''); 
    const navigate = useNavigate();

    // 새로운 채팅 세션을 시작하는 함수
    const startNewChat = async () => {
        try {
            const response = await axios.post('http://localhost:8000/chat/start-new-chat');
            setSessionId(response.data.session_id);
            console.log("sessionId:", sessionId);
        } catch (error) {
            console.error("새로운 채팅 세션 시작 오류:", error);
        }
    };


    if (!sessionId) {
        startNewChat();
    }

    // 질문이랑 답변을 채팅 페이지로 보냄
    const handleMainQuery = async (query: string) => { 
        console.log("질문 제출:", query);
        setQuery(query);
        try {
            const response = await axios.post('http://localhost:8000/chat/message', {
                session_id: sessionId,
                chat_detail: query
            });
            navigate('/chat', { state: { sessionId, query, answer: response.data.answer } });
            console.log("응답:", response.data); // 응답 로그 추가
        } catch (error) {
            console.error("질문 제출 오류:", error);
        }
    };

    return (
        <div className={"pc-mainpage"}>
            <SearchPart MainQuery={handleMainQuery} />
            <SearchNavigate />
        </div>
    );
};

export default Main;
