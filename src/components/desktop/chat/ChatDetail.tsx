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

    if (query === null || query.trim() === '') {
      console.log("입력값이 없습니다. 함수 종료.");
      return;
    }
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
                <div key={index} className={`message-wrapper ${msg.type}`}>
                  <div className={`message-label ${msg.type}-label`}>
                    {msg.type === 'user' ? '사용자' : '양파 AI'}
                  </div>
                  <div className={`message ${msg.type}`}
                    style={{ fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                  <div className={`timestamp ${msg.type}-timestamp`}>
                    {new Date(msg.timestamp).toLocaleString()}
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
            id="outlined-basic"
            placeholder="질문을 입력하세요"
            variant="outlined"
            sx={{
              ...makeSx,
            }}
            value={query}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setQuery(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleChatSubmit(e);  // 엔터를 눌렀을 때 전송
              }
            }}
            className="pc-chat-body-searchInput"
            InputProps={{
              endAdornment: (
                <IconButton type="button" onClick={handleChatSubmit}>
                  <Search />
                </IconButton>
              ),
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default ChatDetail;
