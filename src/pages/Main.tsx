import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useMediaQuery } from "react-responsive";
import SearchPart from "../components/desktop/main/SearchPart";
import "../css/mainCsss.scss";
import SearchNavigate from "../components/desktop/main/SearchNavigate";
import axios from "axios";

const Main: React.FC = () => {
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [query, setQuery] = useState<string>(''); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const startNewChat = async () => {
            const response = await axios.post('http://localhost:8080/chat/start-new-chat');
            setSessionId(response.data.session_id);
        };

        startNewChat(); // 컴포넌트가 마운트될 때 새로운 채팅 시작
    }, []);

    //질문이랑 답변을 채팅페이지로 보냄
    const handleMainQuery = async (query: string) => { 
        console.log("질문 제출:", query);
        setQuery(query);
        try {
            const response = await axios.post('http://localhost:8080/chat/message', {
                session_id: sessionId,
                chat_detail: { query: query }
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
