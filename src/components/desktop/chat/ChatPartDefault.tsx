import React from "react";

interface ChatPartDefaultProps {
    onQuestionClick: (question: string) => void;
    showAsk: boolean; // 추가: pc-ask의 표시 여부
}

const ChatPartDefault: React.FC<ChatPartDefaultProps> = ({ onQuestionClick, showAsk }) => {
    const questions = [
        "아이가 편식을 너무 심하게 해",
        "책을 어떻게 읽어 줘야 할까",
        "오은영 10계명 알려줘"
    ];

    if (!showAsk) {
        return null; //showAsk가 false면 null을 반환하여 pc-ask를 숨김
    }

    return (
        <div className={"pc-ask"}>
            <span className={"pc-ask-title"}>육아 고민을 AI에게 물어보세요</span>
            <div className={"pc-ask-question-box"}>
                {questions.map((question, index) => (
                    <div 
                        key={index} 
                        className={"pc-ask-question"} 
                        onClick={() => onQuestionClick(question)}
                    >
                        <span>{question}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatPartDefault;
