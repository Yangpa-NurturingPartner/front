import React from "react";

interface ChatPartDefaultProps {
    onQuestionClick: (query: string) => void;
    onSubmit: () => void;
}

const ChatPartDefault: React.FC<ChatPartDefaultProps> = ({ onQuestionClick, onSubmit }) => {

    const query = [
        "아이가 밥을 안 먹어요 ",
        "책을 어떻게 읽어 줘야 할까",
        "오은영 10계명 알려줘"
    ];

    const handleQuestionClick = (query: string) => {
        console.log("클릭됨");
        onQuestionClick(query); 
        onSubmit(); 
    };

    return (
        <div className="pc-ask"> 
            <span className={"pc-ask-title"}>육아 고민을 AI에게 물어보세요</span>
            <div className={"pc-ask-question-box"}>
                {query.map((query, index) => (
                    <div 
                        key={index} 
                        className={"pc-ask-question"} 
                        onClick={() => handleQuestionClick(query)} 
                    >
                        <span>{query}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatPartDefault;
