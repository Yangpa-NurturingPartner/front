import React, { Dispatch, SetStateAction } from "react";
import { TextField, IconButton } from "@mui/material";
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

const ChatContent: React.FC<ChatContentProps> = ({ messages, setMessages, query, setQuery, isChatEnded, endstartChat, session_id }) => {
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isChatEnded || !session_id || !query.trim()) return;

        const userMessage: Message = { type: 'user', text: query };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        try {
            const response = await axios.post('http://localhost:8080/chat/message', {
                session_id,
                chat_detail: { query }
            });

            const botAnswer = response.data.answer || '답변이 없습니다.';
            const botMessage: Message = { type: 'bot', text: botAnswer };

            setMessages(prevMessages => [...prevMessages, botMessage]);
            setQuery('');
        } catch (error) {
            const errorMessage: Message = { type: 'error', text: '오류가 발생했습니다.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
            console.error('오류 발생:', error);
        }
    };

    return (
        <div className="pc-show-chat">
            <div className="pc-chat-part">
                <ChatPartDefault />
            </div>
            
            <div className="pc-chat-content">
                <div style={{ height: '100%', width: '100%', overflowY: 'auto', paddingBottom: '10vh' }}>
                    <div style={{ padding: '10px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`} style={{ margin: '5px 0' }}>
                                <strong>{msg.type === 'user' ? '사용자' : '챗봇'}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="pc-chat-input">
                    <TextField
                        id="outlined-basic"
                        label="육아 고민을 적어주세요"
                        variant="outlined"
                        sx={makeSx}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isChatEnded}
                        className="pc-chat-body-searchInput"
                    />
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <IconButton type="submit" disabled={isChatEnded}>
                            <img src="/img/send.png" alt="Send" className="pc-chat-icon" />
                        </IconButton>
                        <IconButton type="button" onClick={endstartChat} disabled={isChatEnded}>
                            새로운 채팅 시작
                        </IconButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatContent;
