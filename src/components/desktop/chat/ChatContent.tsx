import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton, CircularProgress } from "@mui/material";
import { Search } from '@mui/icons-material';

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
    handleSubmit: () => Promise<void>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    endStartChat: () => Promise<void>;
    setSession_id: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatContent: React.FC<ChatContentProps> = ({ setSession_id, endStartChat, messages, handleSubmit,  query, setQuery, isChatEnded, isLoading, setIsLoading }) => {
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

    //간편질문 클릭 시 바로 전송
    const handleQuestionClick = async (query: string) => {
        setSession_id(null);
        console.log("질문 클릭:", query);
        setQuery(query);
        setIsLoading(true);
        await navigate('/chat', { state: { query } });
    };

    return (
        <div className="pc-show-chat">
            <div className={`pc-chat-part ${messages.length > 0 && !localStorage.getItem("end") ? 'blank' : ''}`}>
                <ChatPartDefault
                    onQuestionClick={handleQuestionClick}
                    onSubmit={handleSubmit} 
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