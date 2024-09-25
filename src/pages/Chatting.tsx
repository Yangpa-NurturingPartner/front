import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Sidebar from "../components/desktop/chat/Sidebar";
import "../css/chatCss.scss";
import { useMediaQuery } from "react-responsive";
import ChatContent from "../components/desktop/chat/ChatContent";
import ChatDetail from "../components/desktop/chat/ChatDetail";
import axios from 'axios';

interface Message {
    type: 'user' | 'bot' | 'error';
    text: string;
}

const Chatting: React.FC = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const location = useLocation(); 
    const sessionId = location.state?.sessionId; 
    const initialQuery = location.state?.query; 
    const initialAnswer = location.state?.answer; 
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isChatEnded, setIsChatEnded] = useState(false);
    const [currentSession_id, setCurrentSession_id] = useState<string | null>(sessionId || null);
    const [chatDetail, setChatDetail] = useState<any[]>([]); 
    const [showChatDetail, setShowChatDetail] = useState(false);
    const [isInitialQueryAnswered, setIsInitialQueryAnswered] = useState(false);

    const viewChatDetail = async (sessionId: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/chat-record-view/${sessionId}`);
            setChatDetail(response.data);
            setShowChatDetail(true);
        } catch (error) {
            console.error('채팅 상세 불러오기 오류:', error);
        }
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    const endstartChat = async () => {
        try {
            if (currentSession_id) {
                await axios.post('http://localhost:8080/chat/end-chat', null, { params: { session_id: currentSession_id } });
                setMessages(prevMessages => [...prevMessages, { type: 'bot', text: '채팅이 종료되었습니다.' }]);
                setIsChatEnded(true);
            }
    
            const response = await axios.post('http://localhost:8080/chat/start-new-chat');
            const newSession_id = response.data.session_id;
    
            if (newSession_id) {
                setCurrentSession_id(newSession_id);
                setMessages([]); 
                setQuery(''); 
                setIsChatEnded(false); 
                setShowChatDetail(false); 
                setIsInitialQueryAnswered(false); 
            } else {
                console.error('세션 ID를 받아오지 못했습니다.');
            }
        } catch (error) {
            console.error('채팅 종료 및 시작 오류:', error);
        }
    };

    const handleNewChat = () => {
        endstartChat(); 
    };

    const addInitialMessages = async () => {
        const userMessage: Message = { type: 'user', text: initialQuery };
        const botMessage: Message = { type: 'bot', text: initialAnswer };

        await new Promise<void>((resolve) => {
            setMessages(prevMessages => {
                resolve(); // 상태 업데이트 완료 후 resolve
                return [...prevMessages, userMessage, botMessage];
            });
        });      
    };

    useEffect(() => {
        if (sessionId) {
            setCurrentSession_id(sessionId);
        }

        if (initialQuery && initialAnswer && !isInitialQueryAnswered) { // main에서 온 대답을 아직 화면에 안보여줬을때 실행
            addInitialMessages();
            setIsInitialQueryAnswered(true); // 대답을 보여줬냐? -> 네
        }
    }, [sessionId, initialQuery, initialAnswer, isInitialQueryAnswered]);

    return (
        <>
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                viewChatDetail={viewChatDetail}
                endstartChat={endstartChat}
            />
            <div className={`content-container ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
                {showChatDetail ? (
                    <ChatDetail chatDetail={chatDetail} onNewChat={handleNewChat} />
                ) : (
                    <ChatContent
                        messages={messages}
                        setMessages={setMessages}
                        query={query}
                        setQuery={setQuery}
                        isChatEnded={isChatEnded}
                        endstartChat={endstartChat}
                        session_id={currentSession_id || ''}
                    />
                )}
            </div>
        </>
    );
};

export default Chatting;
