import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import { TextField, IconButton, CircularProgress } from "@mui/material";
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
    setQuery: Dispatch<SetStateAction<string>>;
    isChatEnded: boolean;
    endstartChat: () => void;
    session_id: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ messages, setMessages, query, setQuery, isChatEnded, session_id }) => {
    const [isLoading, setIsLoading] = useState(false); //로딩 상태
    const [showAsk, setShowAsk] = useState(true); //간편질문 보여주는 부분
    const navigate = useNavigate();
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
        // 새로고침 시 state를 null로 설정
        if (window.performance && window.performance.navigation.type === 0) {
            navigate('/chat', { state: null });
        }
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (messages.length > 0) {
            setShowAsk(false); // 예: 메시지가 있을 경우 pc-ask 숨김
        }

        if (isChatEnded || !session_id || !query.trim()) {
            if (isChatEnded) {
                alert('채팅이 종료되었습니다. 새 채팅을 시작해주세요.');
            }
            return;
        }

        const userMessage: Message = { type: 'user', text: query };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        setIsLoading(true); // 로딩 시작


        try {
            const response = await axios.post('http://localhost:8000/chat/message', {
                session_id,
                chat_detail: query,
                token: "Bearer " + localStorage.getItem("userToken")
            });

            const botAnswer = response.data.answer || '답변이 없습니다.';
            const botMessage: Message = { type: 'bot', text: botAnswer };

            setMessages(prevMessages => [...prevMessages, botMessage]);
            setQuery('');
        } catch (error: any) {
            const errorMessage: Message = { type: 'error', text: error.response?.data?.message || '오류가 발생했습니다.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
            console.error('오류 발생:', error);
        } finally {
            setIsLoading(false); // 로딩 끝
        }
    };

    const handleQuestionClick = (question: string) => {
        setQuery(question);
    };

    return (
        <div className="pc-show-chat">
            <div className="pc-chat-part">
                <ChatPartDefault onQuestionClick={handleQuestionClick} showAsk={showAsk} />
            </div>
            
            <div className="pc-chat-content">
                <div className="message-container">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <div 
                                className={`message ${msg.type}`}
                                style={{
                                    fontSize: '15px'
                                }}
                                >
                                <strong>{msg.type === 'user' ? '사용자' : '양파AI'}:</strong> {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {isLoading && ( // 로딩 중이면 로딩 스피너 표시
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <CircularProgress />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="pc-chat-input">
                    <TextField
                        id="outlined-basic"
                        label="육아 고민을 적어주세요"
                        variant="outlined"
                        sx={makeSx}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isChatEnded || isLoading} // 로딩 중일 때 입력 비활성화
                        className="pc-chat-body-searchInput"
                    />
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <IconButton type="submit" disabled={isChatEnded || isLoading}> {/* 로딩 중일 때 버튼 비활성화 */}
                            <img src="/img/send.png" alt="Send" className="pc-chat-icon" />
                        </IconButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatContent;