import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SearchPart from "../components/desktop/main/SearchPart";
import "../css/mainCsss.scss";
import SearchNavigate from "../components/desktop/main/SearchNavigate";
import axios from "axios";

interface MainProps {
    showAsk: boolean; 
    setShowAsk: (value: boolean) => void; 
  }

  const Main: React.FC<MainProps> = ({ showAsk, setShowAsk }) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [query, setQuery] = useState<string>(''); 
    const navigate = useNavigate();

    const requestData = {
        oldSession_id: localStorage.getItem("oldSession_id"), // 기존 세션 ID
        jwtToken: "Bearer " + localStorage.getItem("jwtToken"),
        child_id: 1
    };

    // 새로운 채팅
    const startNewChat = async () => {
        console.log("채팅 시작");
        try {
            //const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
            //const response = await axios.post(`${SERVER_PORT}/chat/start-new-chat`, requestData, {
            const response = await axios.post('http://localhost:8000/chat/start-new-chat', requestData, {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': requestData.jwtToken,
                }
            });
            setSessionId(response.data.session_id);
            console.log("sessionId1 = " + response.data.session_id);
            console.log("sessionId2 = " + sessionId); //딜레이
        } catch (error) {
            console.error("새로운 채팅 세션 시작 오류:", error);
        }
    };

    useEffect(() => {
            startNewChat();
            setShowAsk(false);
    }, [setShowAsk]); 

    // 질문과 답변을 채팅 페이지로 보냄
    const handleMainQuery = async (query: string) => { 
        console.log("질문 제출:", query);
        setQuery(query);
        console.log("showAsk!!!!!! :", showAsk);
        try {
            const response = await axios.post('http://localhost:8000/chat/message', {
                session_id: sessionId,
                chat_detail: query,
                token: "Bearer " + localStorage.getItem("jwtToken")
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
