import React from 'react';

interface ChatDetailProps {
  chatDetail: {
    query: string;
    answer: string;
    qa_time: string;
  }[];
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chatDetail }) => {
  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>채팅</h1>
      </header>
      <div className="message-container">
        {chatDetail.length > 0 ? (
          chatDetail.map((detail, index) => (
            <div key={index}>
              <div className="message user">
                {detail.query}
                <span className="timestamp">{new Date(detail.qa_time).toLocaleString()}</span>
              </div>
              <div className="message bot">
                {detail.answer}
                <span className="timestamp">{new Date(detail.qa_time).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-records">채팅 기록이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ChatDetail;