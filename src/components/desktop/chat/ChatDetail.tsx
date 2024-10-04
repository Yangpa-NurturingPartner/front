import React, { useEffect, useState } from 'react';

interface ChatDetailProps {
  chatDetail: {
    query: string;
    answer: string;
    qa_time: string;
  }[];
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chatDetail }) => {
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string; timestamp: string }[]>([]);

  useEffect(() => {
    // chatDetail prop이 변경될 때마다 messages 초기화

    console.log(chatDetail);
    /*
  {
    "status": "success",
    "message": "채팅 상세 정보가 성공적으로 반환되었습니다.",
    "data": [
        {
            "qa_id": 731,
            "query": "오은영 10계명 알려줘",
            "answer": "오은영 박사의 10계명은 다음과 같습니다:\n\n1. **사랑과 관심을 표현하라**: 아이에게 애정과 관심을 꾸준히 보여준다.\n2. **일관성을 유지하라**: 규칙과 원칙을 일관되게 적용한다.\n3. **자기주도성을 키워주라**: 아이가 스스로 선택하고 결정할 수 있도록 격려한다.\n4. **긍정적인 언어를 사용하라**: 부정적인 표현보다는 긍정적인 언어로 소통한다.\n5. **감정을 존중하라**: 아이의 감정을 이해하고 존중해준다.\n6. **모델이 되어라**: 부모가 먼저 좋은 행동을 보여준다.\n7. **자신감을 심어주라**: 아이의 성취를 인정하고 칭찬한다.\n8. **균형 잡힌 생활을 하라**: 규칙적인 생활습관과 다양한 경험을 제공한다.\n9. **소통을 강화하라**: 아이와의 대화를 통해 서로의 생각을 나눈다.\n10. **사람의 소중함을 가르쳐라**: 타인에 대한 배려와 존중을 가르친다.\n\n이 원칙들은 아이의 건강한 성장과 발달에 도움을 주기 위해 제안된 것입니다.",
            "session_id": "064b4467-abe8-4cd1-80d1-09b22260c9b3",
            "qa_time": "2024-10-04T07:19:47.520+00:00"
        }
    ]
}
    */

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
                    <strong>{msg.type === 'user' ? '사용자' : '양파 AI'}:</strong> {msg.text}
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
