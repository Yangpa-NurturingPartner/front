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
    const [isLoading, setIsLoading] = useState(false);
    const [showAsk, setShowAsk] = useState(true);
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
        if (window.performance && window.performance.navigation.type === 0) {
            navigate('/chat', { state: null });
        }
    }, [navigate]);

    const handleSubmit = async () => {
        setShowAsk(false);

        if (isChatEnded || !session_id || !query.trim()) {
            if (isChatEnded) {
                alert('채팅이 종료되었습니다. 새 채팅을 시작해주세요.');
            }
            return;
        }

        const userMessage: Message = { type: 'user', text: query };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/chat/message', {
                session_id,
                chat_detail: query,
                token: "Bearer " + localStorage.getItem("jwtToken")
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
            setIsLoading(false);
        }
    };

    //간편질문 클릭 시 바로 전송
    const handleQuestionClick = async (question: string) => {
        setShowAsk(false);
        
        const userMessage: Message = { type: 'user', text: question };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        console.log("간편질문 클릭! " + messages);

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/chat/message', {
                session_id,
                chat_detail: question,
                token: "Bearer " + localStorage.getItem("jwtToken")
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
            setIsLoading(false);
        }

    };

    return (
        <div className="pc-show-chat">
            <div className="pc-chat-part">
                <ChatPartDefault 
                    onQuestionClick={handleQuestionClick}
                    onSubmit={handleSubmit} 
                    showAsk={showAsk} 
                />
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
                    disabled={isChatEnded || isLoading} 
                    className="pc-chat-body-searchInput"
                />
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <IconButton 
                            type="button" 
                            onClick={handleSubmit} 
                            disabled={isChatEnded || isLoading}
                        >
                            send
                        </IconButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatContent;
