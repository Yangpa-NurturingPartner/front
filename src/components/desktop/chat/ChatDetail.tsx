import React, { useEffect, useState } from 'react';

interface ChatDetailProps {
  chatDetail: {
    query: string;
    answer: string;
    qa_time: string;
  }[];
  onNewChat: () => void; // 새로운 채팅 시작을 위한 함수 prop 추가
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chatDetail, onNewChat }) => {
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string; timestamp: string }[]>([]);

  useEffect(() => {
    // chatDetail prop이 변경될 때마다 messages 초기화
    const newMessages = chatDetail.map(detail => ({
      type: 'user' as 'user', // 타입을 명시적으로 설정
      text: detail.query,
      timestamp: detail.qa_time,
    }));

    const botMessages = chatDetail.map(detail => ({
      type: 'bot' as 'bot', // 타입을 명시적으로 설정
      text: detail.answer,
      timestamp: detail.qa_time,
    }));

    setMessages([...newMessages, ...botMessages]); //사용자 메시지와 봇 메시지를 합쳐서 상태 업데이트
  }, [chatDetail]); //chatDetail이 변경될 때마다 effect 실행

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
                    <strong>{msg.type === 'user' ? '사용자' : '챗봇'}:</strong> {msg.text}
                    <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))
          ) : (
            <div className="no-records">채팅 기록이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatDetail;
