import React, { useState, useEffect } from "react";
import Sidebar from "../components/desktop/chat/Sidebar";
import "../css/chatCss.scss";
import { useMediaQuery } from "react-responsive";
import ChatContent from "../components/desktop/chat/ChatContent";
import ChatDetail from "../components/desktop/chat/ChatDetail";
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Message {
    type: 'user' | 'bot' | 'error';
    text: string;
}

const Chatting: React.FC = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const { session_id } = useParams();
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isChatEnded, setIsChatEnded] = useState(false);
    const [currentSession_id, setCurrentSession_id] = useState<string | null>(session_id || null);
    const [chatDetail, setChatDetail] = useState<any[]>([]); 
    const [showChatDetail, setShowChatDetail] = useState(false);

    const viewChatDetail = async (sessionId: string) => {
        console.log("Clicked session ID:", sessionId); 
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
                setIsChatEnded(true); //세션 종료 상태 먼저 업데이트
            }
    
            const response = await axios.post('http://localhost:8080/chat/start-new-chat');
            const newSession_id = response.data.session_id;
    
            if (newSession_id) {
                console.log("새 세션아이디 : " + newSession_id);
                setCurrentSession_id(newSession_id); //새로운 세션 ID 설정
                setMessages([]); //메시지 초기화
                setQuery(''); //입력 초기화
                setIsChatEnded(false); //채팅 활성화
                setShowChatDetail(false); // 채팅 세부사항 숨김
            } else {
                console.error('세션 ID를 받아오지 못했습니다.');
            }
        } catch (error) {
            console.error('채팅 종료 및 시작 오류:', error);
        }
    };

    const handleNewChat = () => {
        endstartChat(); // 새로운 채팅 시작
    };

    useEffect(() => {
        const checkSession = async () => {
            if (currentSession_id) {
                try {
                    const response = await axios.post('http://localhost:8080/chat/message', {
                        session_id: currentSession_id,
                        chat_detail: {}
                    });
                    if (response.status === 500) {
                        const newResponse = await axios.post('http://localhost:8080/chat/start-new-chat');
                        const newSession_id = newResponse.data.session_id;
                        setCurrentSession_id(newSession_id);
                    }
                } catch (error) {
                    console.error('세션 확인 오류:', error);
                }
            }
        };

        checkSession();
    }, [currentSession_id]);

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
