import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'; 
import { TextField, IconButton, CircularProgress } from "@mui/material";
import { QuestionAnswer, Search } from '@mui/icons-material';
import axios from "axios";
import ChatPartDefault from "./ChatPartDefault";

interface Message {
    type: 'user' | 'bot' | 'error';
    text: string;
}

interface ChatContentProps {
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string | null>>;
    isChatEnded: boolean;
    endstartChat: () => void;
    session_id: string;
    fetchChatSummaries: () => Promise<void>;
}

const ChatContent: React.FC<ChatContentProps> = ({ messages, setMessages, query, setQuery, isChatEnded, endstartChat, session_id,fetchChatSummaries }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showAsk, setShowAsk] = useState(true);
    const navigate = useNavigate();
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    const makeSx = {
        width: "70%",
        backgroundColor: "#F4F4F4",
        borderRadius: "15px",
        border: "none",
        boxShadow: "2px 2px 5px #DADADA",
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                border: "none",
            },
            "&:hover fieldset": {
                border: "none",
            },
            "&.Mui-focused fieldset": {
                border: "none",
            },
        },
        "& .MuiInputLabel-root": {
            color: "rgb(AAAAAA)",
            "&.Mui-focused": {
                display: "none",
                color: "black",
            },
        },
    };

    useEffect(() => {
        if (window.performance && window.performance.navigation.type === 0) {
            navigate('/chat', { state: null });
        }
    }, [navigate]);

    //스크롤 자동 내리기
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom(); 
    }, [messages]);

    //질문 제출
    const handleSubmit = async () => {
        setShowAsk(false);
        if (!session_id) {
            console.log("sessionID 받아오기");
            await endstartChat();
        } else {
            console.log("123123");
            await sendMessage();
        }
    };

    useEffect(() => {
        if (session_id && query) {
            sendMessage();
        }
    }, [session_id]); 
    
    const sendMessage = async () => {
        const question = localStorage.getItem("question");
        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT;
    
        if (question) {
            const userMessage: Message = { type: "user", text: question };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setIsLoading(true);
            console.log("question: ", question);
    
            try {
                const response = await axios.post(`http://${serverIp}:${port}/chat/message`, {
                    session_id,
                    chat_detail: question,
                    token: "Bearer " + localStorage.getItem("jwtToken"),
                });
    
                const botAnswer = response.data.data.answer || '답변이 없습니다.';
                const botMessage: Message = { type: "bot", text: botAnswer };
    
                setMessages((prevMessages) => [...prevMessages, botMessage]);
                localStorage.removeItem("question");
                fetchChatSummaries();
            } catch (error: any) {
                const errorMessage: Message = { type: "error", text: error.response?.data?.message || "오류가 발생했습니다." };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
                console.error("오류 발생:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            const userMessage: Message = { type: "user", text: query };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setIsLoading(true);
            console.log("질문 제출 아이디: ", session_id);
            console.log("query: ", query);
    
            try {
                const response = await axios.post(`http://${serverIp}:${port}/chat/message`, {
                    session_id,
                    chat_detail: query,
                    token: "Bearer " + localStorage.getItem("jwtToken"),
                });
    
                const botAnswer = response.data.data.answer || '답변이 없습니다.';
                const botMessage: Message = { type: "bot", text: botAnswer };
    
                setMessages((prevMessages) => [...prevMessages, botMessage]);
                setQuery(''); // 쿼리 초기화
                fetchChatSummaries();
            } catch (error: any) {
                const errorMessage: Message = { type: "error", text: error.response?.data?.message || "오류가 발생했습니다." };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
                console.error("오류 발생:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    //간편질문 클릭 시 바로 전송
    const handleQuestionClick = async (question: string) => {
        setShowAsk(false);
        localStorage.setItem("question", question);
        setIsLoading(true);
        setQuery('');
        await handleSubmit();
    };


    return (
        <div className="pc-show-chat">
             <div className={`pc-chat-part ${messages.length > 0 ? 'blank' : ''}`}>
                {showAsk && (
                    <ChatPartDefault 
                    onQuestionClick={handleQuestionClick}
                    onSubmit={handleSubmit}
                    />
                )}
            </div>
    
            <div className="pc-chat-content">
                <div className="message-container">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <div 
                                className={`message ${msg.type}`}
                                style={{ fontSize: '15px' }}
                            >
                                <strong>{msg.type === 'user' ? '사용자' : '양파AI'}:</strong> {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>
    
                {isLoading && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <CircularProgress />
                    </div>
                )}
    
                <form className="pc-chat-input">
                    <TextField
                        id="outlined-basic"
                        placeholder="육아 고민을 적어주세요"
                        variant="outlined"
                        sx={makeSx}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit(); 
                            }
                        }}
                        disabled={isLoading} 
                        className="pc-chat-body-searchInput"
                    />
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <IconButton 
                            type="button" 
                            onClick={handleSubmit} 
                            disabled={isChatEnded || isLoading}
                        >
                            <Search /> 
                        </IconButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
    
export default ChatContent;