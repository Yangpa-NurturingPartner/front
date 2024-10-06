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
    const [query, setQuery] = useState<string | null>(location.state?.query || null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isChatEnded, setIsChatEnded] = useState(false);
    const [session_id, setSession_id] = useState<string | null>(location.state?.session_id || null);
    const [chatDetail, setChatDetail] = useState<any[]>([]);
    const [showChatDetail, setShowChatDetail] = useState(false);
    const [showAsk, setShowAsk] = useState(true);
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
        localStorage.setItem("end", "end");
        await new Promise<void>((resolve) => {
            setSession_id(null);
            resolve();
        });
        console.log("Endsession 실행됨");
        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT;
        setMessages([]); // 화면에 보여지는 메시지 초기화
        setShowChatDetail(false);
        setShowAsk(true);
        setIsChatEnded(true);
        setQuery('');
        try {
            await axios.post(`http://${serverIp}:${port}/chat/end-chat`, null, { params: { session_id: session_id } });
            console.log("채팅이 종료되었습니다.");
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('endSession 오류:', axiosError.response ? axiosError.response.data : axiosError.message);
        }
        console.log("endsession? " + session_id);
    };

    //새 세션id받아오기
    const endstartChat = async () => {
        localStorage.removeItem("end");
        const storedProfile = localStorage.getItem("selectedProfile");
        let profile;
        if (storedProfile) { profile = JSON.parse(storedProfile); } else { console.log("selectedProfile이 없습니다."); }

        const requestData = {
            jwtToken: "Bearer " + localStorage.getItem("jwtToken"),
            child_id: profile.childId
        };

        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT;

        try {
            const response = await axios.post(`http://${serverIp}:${port}/chat/start-new-chat`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': requestData.jwtToken,
                }
            });

            if (response.data.data.session_id) {
                setSession_id(response.data.data.session_id);
                navigate('/chat', { state: { session_id: response.data.data.session_id } });
            } else {
                console.error('endstartChat + 세션 ID를 받아오지 못했습니다.');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('endstartChat + 채팅 종료 및 시작 오류:', axiosError.response ? axiosError.response.data : axiosError.message);
        }
    };

    //메인에서 보낸 질문
    const fetchInitialAnswer = async (query: string) => {
        localStorage.removeItem("mainQuery");
        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT;

        setIsLoading(true); // 요청 전에 로딩 시작
        try {
            const userQuery = query;
            const response = await axios.post(`http://${serverIp}:${port}/chat/message`, {
                session_id: session_id,
                chat_detail: query,
                token: "Bearer " + localStorage.getItem("jwtToken")
            });
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
    };

    //메세지 추가시 출력 + 스크롤
    useEffect(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (!session_id) {
            endstartChat();
            const mainQuery = localStorage.getItem("mainQuery");
            if (mainQuery) {
                fetchInitialAnswer(mainQuery);
            } else {
                console.error("mainQuery가 null입니다. fetchInitialAnswer를 호출할 수 없습니다.");
            }
        }
    }, [isChatEnded]);

    useEffect(() => {
        // 페이지를 나갈 때
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            console.log("handleBeforeUnload 실행됨");
            if (session_id) {
                endSession();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            endSession();
        };
    }, []);

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
