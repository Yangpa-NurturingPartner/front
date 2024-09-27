import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Sidebar from "../components/desktop/chat/Sidebar";
import "../css/chatCss.scss";
import ChatContent from "../components/desktop/chat/ChatContent";
import ChatDetail from "../components/desktop/chat/ChatDetail";
import axios, { AxiosError } from 'axios';

interface Message {
    type: 'user' | 'bot' | 'error'; // 메시지 유형 정의
    text: string; // 메시지 텍스트
}

const Chatting: React.FC = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // 사이드바 상태
    const location = useLocation(); 
    const [sessionId, setSessionId] = useState<string | null>(location.state?.sessionId || null); // 메인에서 이어지는 세션 ID
    const [initialQuery, setInitialQuery] = useState(location.state?.query || null);
    const [initialAnswer, setInitialAnswer] = useState(location.state?.answer || null); 
    const [query, setQuery] = useState(''); // 사용자 쿼리
    const [messages, setMessages] = useState<Message[]>([]); // 메시지 목록
    const [isChatEnded, setIsChatEnded] = useState(false); // 채팅 종료 상태
    const [session_id, setSession_id] = useState<string | null>(null); // 현재 세션 ID
    const [chatDetail, setChatDetail] = useState<any[]>([]); // 채팅 상세 내용
    const [showChatDetail, setShowChatDetail] = useState(false); // 채팅 상세 보기 상태
    const [isInitialQueryAnswered, setIsInitialQueryAnswered] = useState(false); // 초기 질문 응답 상태

    // 채팅 상세 내용 보기 함수
    const viewChatDetail = async (session_id: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/chat/chat-record-view/${session_id}`);
            setChatDetail(response.data);
            setShowChatDetail(true);
        } catch (error) {
            console.error('채팅 상세 불러오기 오류:', error);
        }
    };

    // 사이드바 토글 함수
    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    // 세션 종료 함수
    const endSession = async () => {
        try {
            await axios.post('http://localhost:8000/chat/end-chat', null, { params: { session_id:  localStorage.getItem("localsession_id") } });
            console.log("채팅이 종료되었습니다.");
            setMessages(prevMessages => [...prevMessages, { type: 'bot', text: '채팅이 종료되었습니다.' }]);
            setIsChatEnded(true);
            localStorage.removeItem("localsession_id"); //로컬스토리지에서 세션 ID 삭제
            console.log("null이나와야함 = " +  localStorage.getItem("localsession_id"));

        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('endSession 오류:', axiosError.response ? axiosError.response.data : axiosError.message);
        }
    };

    // 새로운 채팅 시작 함수
    const endstartChat = async () => {
        await endSession(); // 이전 세션 종료
        console.log("채팅 종료 및 새 세션 시작 요청 전송");
    
        try {
            const response = await axios.post('http://localhost:8000/chat/start-new-chat', null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
    
            console.log('Response:', response);
    
            const newSession_id = response.data.session_id; // 새로운 세션 ID 가져오기
            console.log("newSession_id = " + newSession_id);
    
            if (newSession_id) {
                setSession_id(newSession_id); // 새로운 세션 ID 상태 업데이트
                localStorage.setItem("localsession_id", newSession_id); // 세션 ID를 로컬 스토리지에 저장
                console.log("localStorage.getItem = " + localStorage.getItem("localsession_id"));

                setMessages([]); // 메시지 초기화
                setQuery(''); // 쿼리 초기화
                setIsChatEnded(false); // 채팅 종료 상태 초기화
                setShowChatDetail(false); // 채팅 상세 보기를 초기화
                setIsInitialQueryAnswered(false); // 초기 질문 응답 상태 초기화
                console.log("endstartChat + 채팅 새로 시작");
                console.log("할당된세션아이디 : " + session_id);
            } else {
                console.error('endstartChat + 세션 ID를 받아오지 못했습니다.');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('endstartChat + 채팅 종료 및 시작 오류:',  axiosError.response ? axiosError.response.data : axiosError.message);
        }
    };

    // 초기 메시지 추가 함수
    const addInitialMessages = async () => {
        const userMessage: Message = { type: 'user', text: initialQuery };
        const botMessage: Message = { type: 'bot', text: initialAnswer };

        await new Promise<void>((resolve) => {
            setMessages(prevMessages => {
                resolve();
                return [...prevMessages, userMessage, botMessage];
            });
        });
    };

    useEffect(() => {
        if (sessionId) { //메인에서 이어지는 경우
            console.log("메인에서온 sessionId= " + sessionId);
            setSession_id(sessionId); // 로컬 스토리지의 세션 ID로 업데이트
            console.log("메인에서 넘겨준 session_id = " + session_id);
            setSessionId(null);
            console.log("sessionId nul나와야함 = " + sessionId);
        } else{
            console.error('session_id가 존재하지 않습니다. 새 채팅 세션 시작.');
            endstartChat(); // 새 채팅 세션 시작
        }

        console.log('새로운 session_id:', session_id);
    
        // 초기 쿼리와 초기 답변이 있을 경우 메시지 추가
        if (initialQuery && initialAnswer && !isInitialQueryAnswered) {
            addInitialMessages();
            setIsInitialQueryAnswered(true);
            console.log("메인페이지에서 질답 받아옴");
            setInitialQuery(null);
            setInitialAnswer(null);
        }
    
        // 페이지 언로드 이벤트 핸들러
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            console.log("handleBeforeUnload 실행됨");
            endSession();
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    
    
    return (
        <>
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                viewChatDetail={viewChatDetail}
                endstartChat={endstartChat} // 새 채팅 시작 핸들러 전달
            />
            <div className={`content-container ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
                {showChatDetail ? (
                    <ChatDetail chatDetail={chatDetail} onNewChat={endstartChat} />
                ) : (
                    <ChatContent
                        messages={messages}
                        setMessages={setMessages}
                        query={query}
                        setQuery={setQuery}
                        isChatEnded={isChatEnded}
                        endstartChat={endstartChat}
                        session_id={session_id || ''} // 세션 ID 전달
                    />
                )}
            </div>
        </>
    );
};

export default Chatting;
