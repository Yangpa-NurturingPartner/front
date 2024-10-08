import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "../components/desktop/chat/Sidebar";
import "../css/chatCss.scss";
import ChatContent from "../components/desktop/chat/ChatContent";
import ChatDetail from "../components/desktop/chat/ChatDetail";
import axios, { AxiosError } from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Message {
    type: 'user' | 'bot' | 'error';
    text: string;
    timestamp: string; 
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
    const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [oldSessionId, setOldSessionId] = useState<string | null>(null);
    const childId = useSelector((state: RootState) => state.profile.selectedProfile?.childId);

    const serverIp: string | undefined = process.env.REACT_APP_HOST;
    const port: string | undefined = process.env.REACT_APP_BACK_PORT;


    //질문 보내기
    const handleSubmit = async () => {
        console.log("handleSubmit 호출");


        if ( query === null || query.trim() === '') {
            if(!localStorage.getItem("clickQuery")){
            console.log("입력값이 없습니다. 함수 종료.");
            return; 
            }
        }
    
        if (!session_id || localStorage.getItem("clickQuery")) {
            console.log("handleSubmit session_id없음");
            await endstartChat();
            while (!session_id) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            localStorage.removeItem("clickQuery");
        } else {
            console.log("handleSubmit -> else");
            setIsChatEnded(false);
            await sendMessage();
        }
    };
    

    useEffect(() => {
        console.log("test -> session_id:", session_id, "query:", query);
        if (session_id && query) {
            console.log("test 222");
            sendMessage();
        }
    }, [session_id]);

    const sendMessage = async () => {
        console.log("sendMessage호출됨");
        
        const timestamp = new Date().toISOString();
        const userMessage: Message = { type: "user", text: query || "", timestamp: timestamp };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setIsLoading(true);
    
        try {
            const response = await axios.post(`http://${serverIp}:${port}/chat/message`, {
                session_id,
                chat_detail: query,
                token: "Bearer " + localStorage.getItem("jwtToken"),
            });
    
            const botAnswer = response.data.data.answer || '답변이 없습니다.';
            const botMessage: Message = { type: "bot", text: botAnswer, timestamp: timestamp }; 
            console.log("answer: " + botAnswer);
            console.log("qa_time: " + response.data.data.qa_time);
    
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            setQuery(''); 
            fetchChatSummaries();
        } catch (error: any) {
            const errorMessage: Message = { type: "error", text: error.response?.data?.message || "오류가 발생했습니다.", timestamp: timestamp };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
            console.error("오류 발생:", error);
        } finally {
            setIsLoading(false);
        }
    };
    

    //과거 채팅 상세 보기
    const viewChatDetail = async (session_id: string) => {
        setOldSessionId(session_id);
        try {
            const response = await axios.get(`http://${serverIp}:${port}/chat/chat-record-view/${session_id}`);
            setChatDetail(response.data.data);
            setShowChatDetail(true);
        } catch (error) {
            console.error('채팅 상세 불러오기 오류:', error);
        }
    };

    // 사이드바 토글
    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    // 세션 종료 
    const endSession = async () => {
        setIsLoading(false);
        localStorage.setItem("end", "end");
        localStorage.removeItem("nowChatting");
        await new Promise<void>((resolve) => {
            setSession_id(null);
            resolve();
        });
        setMessages([]); // 화면에 보여지는 메시지 초기화
        setShowChatDetail(false);
        setIsChatEnded(true);
        setQuery('');
        try {
            await axios.post(`http://${serverIp}:${port}/chat/end-chat`, null, { params: { session_id: session_id } });
            console.log("채팅이 종료되었습니다.");
        } catch (error) {
            console.log("endSession 오류");
        }
        setSession_id(null);
        console.log("endsession? " + session_id);
    };

    //새 세션id받아오기
    const endstartChat = async () => {
        localStorage.setItem("nowChatting", "nowChatting");
        localStorage.removeItem("end");
        if (!childId) {
            alert("선택된 아이가 없습니다.");
            return;
        }

        const child_num = childId;

        const requestData = {
            jwtToken: "Bearer " + localStorage.getItem("jwtToken"),
            child_id: child_num
        };

        try {
            const response = await axios.post(`http://${serverIp}:${port}/chat/start-new-chat`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': requestData.jwtToken,
                }
            });

            if (response.data.data.session_id) {
                setSession_id(response.data.data.session_id);
                const session_id = response.data.data.session_id;
                navigate('/chat', { state: { session_id: session_id} });
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
        console.log("fetchInitial 호출됨");
        setIsLoading(true);
        if(session_id){
            try {
                const timestamp = new Date().toISOString();
                const userQuery = query;
                console.log("fetchInitial", session_id, query);
                const response = await axios.post(`http://${serverIp}:${port}/chat/message`, {
                    session_id: session_id,
                    chat_detail: query,
                    token: "Bearer " + localStorage.getItem("jwtToken")
                });
                const userMessage: Message = { type: 'user', text: userQuery, timestamp: timestamp  };
                const botMessage: Message = { type: 'bot', text: response.data.data.answer, timestamp: timestamp };
                setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages, userMessage, botMessage];
                    setIsLoading(false); 
                    return updatedMessages; 
                });
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error("AxiosError 발생:", error.response.data);
                } else {
                    console.error("기타 오류:", error);
                }
            } 
        }
    };

    //메세지 추가시 출력 + 스크롤
    useEffect(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);

    //메인에서 보낸 query
    useEffect(() => {
        if (!session_id) {
            endstartChat();
            if (query) {
                fetchInitialAnswer(query);
                console.log("fetchInitail 실행");
            } else {
                console.log("mainQuery가 null입니다.");
            }
        }
    }, [isChatEnded]);
    

    // 페이지를 나갈 때
    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
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

    //요약본 불러오기
    const fetchChatSummaries = async () => {
        console.log("fetchChatSummaries 실행")
        const jwtToken = "Bearer " + localStorage.getItem("jwtToken");

        //해당 user의 session_id가져오기
        try {
            const response = await axios.post(`http://${serverIp}:${port}/chat/user-chat-record`, {
                'token': jwtToken
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const summaries = Array.isArray(response.data.data) ? response.data.data : [];
            console.log("summaries", summaries);
            setChatSummaries(summaries);
        } catch (error) {
            console.error('채팅 요약 불러오기 오류:', error);
        }
    };

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
                fetchChatSummaries={fetchChatSummaries}
                chatSummaries={chatSummaries}
                setChatSummaries={setChatSummaries}
            />
            <div className={`content-container ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
                {showChatDetail ? (
                    <ChatDetail
                        chatDetail={chatDetail}
                        setSession_id={setSession_id}
                        setQuery={setQuery}
                        setShowChatDetail={setShowChatDetail}
                    />
                ) : (
                    <>
                        <ChatContent
                            chatDetail={chatDetail}
                            handleSubmit={handleSubmit}
                            messages={messages}
                            setMessages={setMessages}
                            query={query || ''}
                            setQuery={setQuery}
                            isChatEnded={isChatEnded}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            endStartChat={endstartChat}
                            setSession_id={setSession_id}
                            session_id={session_id}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default Chatting;
