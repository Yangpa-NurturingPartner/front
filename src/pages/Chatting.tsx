import React, { useState, useEffect } from "react";
import { useLocation, useNavigate} from 'react-router-dom';
import Sidebar from "../components/desktop/chat/Sidebar";
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
    const [sessionId, setSessionId] = useState<string | null>(location.state?.sessionId || null); //메인에서 이어지는 세션 ID
    const [initialQuery, setInitialQuery] = useState(location.state?.query || null);
    const [initialAnswer, setInitialAnswer] = useState(location.state?.answer || null); 
    const [query, setQuery] = useState(''); 
    const [messages, setMessages] = useState<Message[]>([]); 
    const [isChatEnded, setIsChatEnded] = useState(false); 
    const [session_id, setSession_id] = useState<string | null>(null); 
    const [chatDetail, setChatDetail] = useState<any[]>([]); 
    const [showChatDetail, setShowChatDetail] = useState(false);
    const [showAsk, setShowAsk] = useState(true);
    const [isInitialQueryAnswered, setIsInitialQueryAnswered] = useState(false);

    const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([]);
    

    const navigate = useNavigate();

    //채팅 상세 내용 보기 함수
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
        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT; 
        try { await axios.post(`http://${serverIp}:${port}/chat/end-chat`, null, { params: { sessionId: localStorage.getItem("localsession_id") } 
            });
            console.log("채팅이 종료되었습니다.");
    
            setInitialAnswer([]);
            setInitialQuery([]);
            setMessages([]); // 화면에 보여지는 메시지 초기화
            console.log(messages);
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
        console.log("showChatDetail? " + showChatDetail);
    
        const requestData = {
            jwtToken: "Bearer " + localStorage.getItem("jwtToken"),
            child_id: 1 
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
    
            console.log('Response:', response);
    
            const newSession_id = response.data.data.session_id; 
            console.log("newSession_id = " + newSession_id);

            setMessages([]);
            setQuery(''); 
            setIsChatEnded(false); 
            setIsInitialQueryAnswered(false); 
            setShowAsk(true);
            console.log("showAsk = " + showAsk);
    
            if (newSession_id) {
                setSession_id(newSession_id); 
                localStorage.setItem("localsession_id", newSession_id); 
    
                console.log("endstartChat + 채팅 새로 시작");
    
                navigate('/chat', { state: { showAsk: true } });
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
            setSessionId(null);
        } else {
            console.error('session_id가 존재하지 않습니다. 새 채팅 세션 시작.');
            endSession(); 
            endstartChat();
        }
    
        const initializeChat = async () => {
            if (initialQuery && initialAnswer && !isInitialQueryAnswered) {
                await addInitialMessages(); 
                setIsInitialQueryAnswered(true);
                console.log("메인페이지에서 받아옴");
                setInitialQuery(null); 
                setInitialAnswer(null);
            }
        };
    
        initializeChat();
    
        //페이지를 나갈때
        const handleBeforeUnload = async(event: BeforeUnloadEvent) => {
            console.log("handleBeforeUnload 실행됨");
            if(sessionId){
                await setSessionId(null);
                endSession(); 
            }
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            console.log("페이지 새로고침");
            if(!sessionId){
                endSession(); //채팅페이지에서 채팅
            }
        };
    }, []);

    const fetchChatSummaries = async () => {
        const jwtToken = "Bearer " + localStorage.getItem("jwtToken");
        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT; 

        try {
            const response = await axios.post(`http://${serverIp}:${port}/chat/user-chat-record`, {
                'token' : jwtToken
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
            // showChatDetail이 false가 되었을 때만 기본 화면으로 이동
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
                    <ChatContent
                        messages={messages}
                        setMessages={setMessages}
                        query={query}
                        setQuery={setQuery}
                        isChatEnded={isChatEnded}
                        endstartChat={endstartChat}
                        session_id={session_id || ''}
                        fetchChatSummaries={fetchChatSummaries}
                    />
                )}
            </div>
        </>
    );
};

export default Chatting;
