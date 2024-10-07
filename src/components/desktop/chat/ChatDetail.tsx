import { Search } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import axios from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

interface Message {
  type: 'user' | 'bot' | 'error';
  text: string;
  timestamp: string;
}

interface ChatDetailProps {
  chatDetail: {
    query: string;
    answer: string;
    qa_time: string;
  }[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string | null>>;
  isChatEnded: boolean;
  session_id: string;
  oldSessionId: string;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  fetchChatSummaries: () => Promise<void>;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ fetchChatSummaries, setSessionId, oldSessionId, isChatEnded, query, setQuery, chatDetail, session_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const makeSx = {
    width: "100%",
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
    console.log("과거 채팅방 session_id: " + oldSessionId);
  }, [oldSessionId]);

  //스크롤
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //메세지 업데이트
  useEffect(() => {
    const newMessages = chatDetail.map(detail => ({
      type: 'user' as 'user',
      text: detail.query,
      timestamp: detail.qa_time,
    }));

    const botMessages = chatDetail.map(detail => ({
      type: 'bot' as 'bot',
      text: detail.answer,
      timestamp: detail.qa_time,
    }));

    setMessages([...newMessages, ...botMessages]);
  }, [chatDetail]);

  const handleChatSubmit = async () => {
    setSessionId(oldSessionId);
    const serverIp: string | undefined = process.env.REACT_APP_HOST;
    const port: string | undefined = process.env.REACT_APP_BACK_PORT;

    const userMessage: Message = { type: "user", text: query || '', timestamp: new Date().toISOString() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`http://${serverIp}:${port}/chat/message`, {
        session_id: oldSessionId,
        chat_detail: query,
        token: "Bearer " + localStorage.getItem("jwtToken"),
      });

      const botAnswer = response.data.data.answer || '답변이 없습니다.';
      const botMessage: Message = { type: "bot", text: botAnswer, timestamp: new Date().toISOString() };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setQuery('');
      fetchChatSummaries();
    } catch (error: any) {
      const errorMessage: Message = { type: "error", text: error.response?.data?.message || "오류가 발생했습니다.", timestamp: new Date().toISOString() };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      console.error("오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
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
                    style={{
                      fontSize: '15px'
                    }}
                  >
                    <strong>{msg.type === 'user' ? '사용자' : '양파 AI'}:</strong> {msg.text}
                    <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))

          ) : (
            <div className="no-records">채팅 기록이 없습니다.</div>
          )}< div ref={messageEndRef} />
        </div>

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
                handleChatSubmit();
              }
            }}
            disabled={isLoading}
            className="pc-chat-body-searchInput"
          />
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <IconButton
              type="button"
              onClick={handleChatSubmit}
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

export default ChatDetail;