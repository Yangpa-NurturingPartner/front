import React from "react";

interface ChatPartDefaultProps {
    onQuestionClick: (question: string) => void;
    showAsk: boolean; 
    onSubmit: () => void;
}

const ChatPartDefault: React.FC<ChatPartDefaultProps> = ({ onQuestionClick, showAsk, onSubmit }) => {
    const questions = [
        "아",
        "책을 어떻게 읽어 줘야 할까",
        "오은영 10계명 알려줘"
    ];

    if (!showAsk) {
        return null;
    }

    const handleQuestionClick = (question: string) => {
        console.log("클릭됨");
        onQuestionClick(question); 
        onSubmit(); 
    };

    return (
        <div className={"pc-ask"}>
            <span className={"pc-ask-title"}>육아 고민을 AI에게 물어보세요</span>
            <div className={"pc-ask-question-box"}>
                {questions.map((question, index) => (
                    <div 
                        key={index} 
                        className={"pc-ask-question"} 
                        onClick={() => handleQuestionClick(question)} 
                    >
                        <span>{question}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatPartDefault;
