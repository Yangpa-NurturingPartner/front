import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

interface ChatDetailProps {
  chatDetail: {
    query: string;
    answer: string;
    qa_time: string;
    session_id: string; 
  }[];
  setSession_id: React.Dispatch<React.SetStateAction<string | null>>;
  setQuery: React.Dispatch<React.SetStateAction<string | null>>;
  setShowChatDetail: (value: boolean) => void; 
}

const ChatDetail: React.FC<ChatDetailProps> = ({ setShowChatDetail, chatDetail, setSession_id, setQuery }) => {
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string; timestamp: string }[]>([]);
  const [oldSessionId, setOldSessionId] = useState<string | null>(null);
  const [query, setLocalQuery] = useState<string>('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newMessages = chatDetail.map(detail => ({ type: 'user' as 'user', text: detail.query, timestamp: detail.qa_time }));
    const botMessages = chatDetail.map(detail => ({ type: 'bot' as 'bot', text: detail.answer, timestamp: detail.qa_time }));
    setMessages([...newMessages, ...botMessages]);
    setOldSessionId(chatDetail[0].session_id);
  }, [chatDetail]);

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

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    setShowChatDetail(false);
    e.preventDefault();
    await new Promise<void>((resolve) => {
      setSession_id(oldSessionId);
      setTimeout(resolve, 0);
    });
    if (!query.trim() || !oldSessionId) return;
    console.log("oldSessionId:", oldSessionId, "query:", query);
    await navigate('/chat', { state: { session_id: oldSessionId, query } });
  };

  return (
    <div className="pc-show-chat">
        <div className="pc-chat-content">
            <header className="chat-header">
                <h1>채팅 기록</h1>
            </header>
            <div className="message-container">
                {messages.length > 0 ? (
                    messages
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                        .map((msg, index) => (
                            <div key={index}>
                                <div
                                    className={`message ${msg.type}`}
                                    style={{ fontSize: '15px', whiteSpace: 'pre-wrap' }} // 줄바꿈을 유지하는 스타일
                                >
                                    <strong>{msg.type === 'user' ? '사용자' : '양파 AI'}:</strong> {msg.text}
                                    <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="no-records">채팅 기록이 없습니다.</div>
                )}
                <div ref={messageEndRef} />
            </div>

            <form className="pc-chat-input" onSubmit={handleChatSubmit}>
                <TextField
                    placeholder="질문을 입력하세요"
                    variant="outlined"
                    sx={makeSx}
                    value={query}
                    onChange={(e) => {
                        setLocalQuery(e.target.value);
                        setQuery(e.target.value); 
                    }}
                />
                <IconButton type="button">
                    <Search />
                </IconButton>
            </form>
        </div>
    </div>
);
}

export default ChatDetail;
