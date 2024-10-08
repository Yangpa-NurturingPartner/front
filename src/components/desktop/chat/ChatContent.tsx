import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton, CircularProgress } from "@mui/material";
import { Search } from '@mui/icons-material';

import ChatPartDefault from "./ChatPartDefault";

interface Message {
    type: 'user' | 'bot' | 'error';
    text: string;
    timestamp: string;
}

interface ChatContentProps {
    chatDetail: {
        query: string;
        answer: string;
        qa_time: string;
        session_id: string;
    }[] | null;
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
    session_id: string | null;
}

const ChatContent: React.FC<ChatContentProps> = ({
    session_id, setSession_id, chatDetail, setMessages, messages,
    handleSubmit, query, setQuery, isChatEnded, isLoading, setIsLoading
}) => {
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

    // 스크롤 자동 내리기
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 간편질문 클릭 시 바로 전송
    const handleQuestionClick = async (query: string) => {
        localStorage.setItem("clickQuery", query);
        await new Promise<void>((resolve) => {
            setSession_id(null);
            setTimeout(resolve, 0);
        });
        setMessages([]);
        setQuery(query);
        console.log("질문 클릭:", query);
        setIsLoading(true);
        await navigate('/chat', { state: { session_id: null, query: query } });
    };

    useEffect(() => {
        if (session_id && chatDetail) {
            const filteredMessages = chatDetail
                .filter(detail => detail.session_id === session_id)
                .map(detail => {
                    const userMessage: Message = { type: 'user', text: detail.query, timestamp: detail.qa_time };
                    const botMessage: Message = detail.answer
                        ? { type: 'bot', text: detail.answer, timestamp: detail.qa_time }
                        : { type: 'error', text: '답변이 없습니다.', timestamp: detail.qa_time };
                    return [userMessage, botMessage];
                })
                .flat();
            setMessages(filteredMessages);
        }
    }, [session_id, chatDetail, setMessages]);

    return (
        <div className="pc-show-chat">
            <div className={`pc-chat-part ${messages.length > 0 && !localStorage.getItem("end") ? 'blank' : ''}`}>
                <ChatPartDefault onQuestionClick={handleQuestionClick} onSubmit={handleSubmit} />
            </div>
            <div className="pc-chat-content">
                <div className="message-container">
                    {chatDetail && !localStorage.getItem("nowChatting") ? (
                        chatDetail
                            .filter(detail => detail.session_id === session_id)
                            .sort((a, b) => new Date(a.qa_time).getTime() - new Date(b.qa_time).getTime()) 
                            .map((detail, index) => (
                                <div key={index} className={`message-wrapper ${detail.query ? 'user' : 'bot'}`}>
                                    {detail.query && (
                                        <>
                                            <div className="message-label user-label">사용자</div>
                                            <div className="message user" style={{ fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                                                {detail.query}
                                            </div>
                                            <div className="timestamp user-timestamp">
                                                {new Date(detail.qa_time).toLocaleString()}
                                            </div>
                                        </>
                                    )}
                                    {detail.answer ? (
                                        <>
                                            <div className="message-label bot-label">양파 AI</div>
                                            <div className="message bot" style={{ fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                                                {detail.answer}
                                            </div>
                                            <div className="timestamp bot-timestamp">
                                                {new Date(detail.qa_time).toLocaleString()}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="no-records">오류가 발생했습니다.</div>
                                    )}
                                </div>
                            ))
                    ) : (
                        <div className="message-container">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message-wrapper ${msg.type}`}>
                                    <div className={`message-label ${msg.type}-label`}>
                                        {msg.type === 'user' ? '사용자' : '양파 AI'}
                                    </div>
                                    <div className={`message ${msg.type}`} style={{ fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                                        {msg.text}
                                    </div>
                                    <div className={`timestamp ${msg.type}-timestamp`}>
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div ref={messageEndRef} />
                    {isLoading && (
                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            <CircularProgress />
                        </div>
                    )}
                </div>
                <form className="pc-chat-input" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        id="outlined-basic"
                        placeholder="육아 고민을 적어주세요"
                        variant="outlined"
                        sx={{
                            ...makeSx,
                        }}
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
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isChatEnded || isLoading}
                                >
                                    <Search />
                                </IconButton>
                            ),
                        }}
                    />
                </form>
            </div>
        </div>
    );
    
};

export default ChatContent;