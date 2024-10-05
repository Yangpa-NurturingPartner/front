import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "../components/desktop/chat/Sidebar";
import { CircularProgress } from "@mui/material";
import "../css/chatCss.scss";
import ChatContent from "../components/desktop/chat/ChatContent";
import ChatDetail from "../components/desktop/chat/ChatDetail";
import axios, { AxiosError } from 'axios';

interface Message {
    type: 'user' | 'bot' | 'error'; 
    text: string; 
}

interface ChatSummary {
    session_id: string;
    end_time: string;
    summ_answer: string;
}

const Chatting: React.FC = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); 
    const location = useLocation(); 
    const [sessionId, setSessionId] = useState<string | null>(location.state?.sessionId || null); // 메인에서 이어지는 세션 ID
    const [query, setQuery] = useState<string | null>(location.state?.query || null); 
    const [messages, setMessages] = useState<Message[]>([]); 
    const [isChatEnded, setIsChatEnded] = useState(false); 
    const [session_id, setSession_id] = useState<string | null>(null); 
    const [chatDetail, setChatDetail] = useState<any[]>([]); 
    const [showChatDetail, setShowChatDetail] = useState(false);
    const [showAsk, setShowAsk] = useState(true);
    const [isInitialQueryAnswered, setIsInitialQueryAnswered] = useState(false);
    const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // 채팅 상세 내용 보기 함수
    const viewChatDetail = async (session_id: string) => {
        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT; 
        try {
            const response = await axios.get(`http://${serverIp}:${port}/chat/chat-record-view/${session_id}`);
            setChatDetail(response.data.data);
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
        console.log("Endsession 실행됨");
        localStorage.removeItem("mainQuery"); 
        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT; 
        try { 
            await axios.post(`http://${serverIp}:${port}/chat/end-chat`, null, { params: { sessionId: localStorage.getItem("localsession_id") } });
            console.log("채팅이 종료되었습니다.");
            setMessages([]); // 화면에 보여지는 메시지 초기화
            setShowChatDetail(false);
            setShowAsk(true);
            setIsChatEnded(true);
            localStorage.removeItem("localsession_id"); // 로컬스토리지에서 세션 ID 삭제
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('endSession 오류:', axiosError.response ? axiosError.response.data : axiosError.message);
        }
    };

    // 새로운 채팅 시작 함수
    const endstartChat = async () => {
        console.log("채팅 종료 및 새 세션 시작 요청 전송");
        setShowChatDetail(false);
        const storedProfile = localStorage.getItem("selectedProfile");
        let profile;
        if (storedProfile) {
            profile = JSON.parse(storedProfile);
            console.log("childId: " + profile.childId);
        } else {
            console.log("selectedProfile이 없습니다.");
        }
            
        const requestData = {
            jwtToken: "Bearer " + localStorage.getItem("jwtToken"),
            child_id: profile.childId 
        };

        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT; 
    
        try {
            const response = await axios.post(`http://${serverIp}:${port}/chat/start-new-chat`, requestData, {
                headers: {
                    'Content-Type': 'application/json', // 요청 본문 형식
                    'Authorization': requestData.jwtToken, // JWT 토큰을 Authorization 헤더에 포함
                }
            });
    
            const newSession_id = response.data.data.session_id; 
            console.log("newSession_id = " + newSession_id);

            setMessages([]);
            setQuery(''); 
            setIsChatEnded(false); 
            setShowAsk(true);
    
            if (newSession_id) {
                setSession_id(newSession_id); 
                localStorage.setItem("localsession_id", newSession_id); 
                console.log("endstartChat + 채팅 새로 시작");
                navigate('/chat', { state: { sessionId: newSession_id } }); // 새 세션 ID 전달
            } else {
                console.error('endstartChat + 세션 ID를 받아오지 못했습니다.');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('endstartChat + 채팅 종료 및 시작 오류:',  axiosError.response ? axiosError.response.data : axiosError.message);
        }
    };

    useEffect(() => {
        if (sessionId) { // 메인에서 이어지는 경우
            console.log("메인에서온 sessionId= " + sessionId);
            setSession_id(sessionId); // 로컬 스토리지의 세션 ID로 업데이트
            setSessionId(null);
        } else {
            console.error('session_id가 존재하지 않습니다. 새 채팅 세션 시작.');
            endSession(); 
            endstartChat();
        }

        //메인에서 보낸 질문
        const fetchInitialAnswer = async () => {
            if (session_id) {
                const serverIp: string | undefined = process.env.REACT_APP_HOST;
                const port: string | undefined = process.env.REACT_APP_BACK_PORT; 
                console.log("query? " + query);
        
                setIsLoading(true); // 요청 전에 로딩 시작
                try {
                    const userQuery = query || ''; // query가 null이면 빈 문자열로 설정
                    const response = await axios.post(`http://${serverIp}:${port}/chat/message`, {
                        session_id,
                        chat_detail: query,
                        token: "Bearer " + localStorage.getItem("jwtToken")
                    });
                    console.log("userQuery ? " + userQuery);
                    const userMessage: Message = { type: 'user', text: userQuery }; 
                    const botMessage: Message = { type: 'bot', text: response.data.data.answer };
                    setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        console.error("AxiosError 발생:", error.response.data);
                    } else {
                        console.error("기타 오류:", error);
                    }
                } finally {
                    setIsLoading(false); // 요청 완료 후 로딩 종료
                }
            }                
        };
    
        fetchInitialAnswer(); // 초기 답변 요청

        // 페이지를 나갈 때
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            console.log("handleBeforeUnload 실행됨");
            if (sessionId) {
                await setSessionId(null);
                endSession(); 
            }
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            console.log("페이지 새로고침");
            if (!sessionId) {
                endSession(); // 채팅페이지에서 채팅
            }
        };
    }, [sessionId]);

    const fetchChatSummaries = async () => {
        const jwtToken = "Bearer " + localStorage.getItem("jwtToken");
        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT; 

        try {
            const response = await axios.post(`http://${serverIp}:${port}/chat/user-chat-record`, {
                'token': jwtToken
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const summaries = Array.isArray(response.data.data) ? response.data.data : [];
            console.log(summaries);
            setChatSummaries(summaries);
        } catch (error) {
            console.error('채팅 요약 불러오기 오류:', error);
        }
    };

    useEffect(() => {
        if (!showChatDetail) {
            setMessages([]);
            setShowAsk(true);
            navigate('/chat', { state: null });
        }
    }, [showChatDetail]);
    
    return (
        <>
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
                viewChatDetail={viewChatDetail}
                endstartChat={endstartChat}
                endSession={endSession}
                showChatDetail={showChatDetail}
                setShowChatDetail={setShowChatDetail}
                showAsk={showAsk}
                setShowAsk={setShowAsk}
                fetchChatSummaries={fetchChatSummaries}
                chatSummaries={chatSummaries}
                setChatSummaries={setChatSummaries}
            />
            <div className={`content-container ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
                {showChatDetail ? (
                    <ChatDetail chatDetail={chatDetail} />
                ) : (
                    <>
                    {isLoading && <CircularProgress style={{ margin: '20px auto', display: 'block' }} />} 
                    <ChatContent
                        messages={messages}
                        setMessages={setMessages}
                        query={query || ''}
                        setQuery={setQuery}
                        isChatEnded={isChatEnded}
                        endstartChat={endstartChat}
                        session_id={session_id || ''}
                        fetchChatSummaries={fetchChatSummaries}
                    />
                    </>
                )}
            </div>
        </>
    );
};

export default Chatting;
