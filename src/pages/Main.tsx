import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SearchPart from "../components/desktop/main/SearchPart";
import "../css/mainCsss.scss";
import SearchNavigate from "../components/desktop/main/SearchNavigate";
import axios from "axios";

const Main: React.FC = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [query, setQuery] = useState<string>(''); 
    const navigate = useNavigate();

    const requestData = {
        oldSession_id: localStorage.getItem("oldSession_id"), // 기존 세션 ID
        jwtToken: "Bearer " + localStorage.getItem("userToken"),
        child_id: 1 // child_id
    };

    //새로운 채팅
    const startNewChat = async () => {
        try {
            const response = await axios.post('http://localhost:8000/chat/start-new-chat', requestData, {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': requestData.jwtToken,
                }
        });
            setSessionId(response.data.session_id);
            localStorage.setItem("localsession_id", response.data.session_id); //세션 ID를 로컬 스토리지에 저장
            console.log("메인 로컬스토리지 저장 = " + localStorage.getItem("localsession_id"));
        } catch (error) {
            console.error("새로운 채팅 세션 시작 오류:", error);
        }
    };


    if (!sessionId) {
        startNewChat();
    }

    //질문이랑 답변을 채팅 페이지로 보냄
    const handleMainQuery = async (query: string) => { 
        console.log("질문 제출:", query);
        setQuery(query);
        try {
            const response = await axios.post('http://localhost:8000/chat/message', {
                session_id: sessionId,
                chat_detail: query,
                token: "Bearer " + localStorage.getItem("userToken")
            });
            navigate('/chat', { state: { sessionId, query, answer: response.data.answer } });
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
