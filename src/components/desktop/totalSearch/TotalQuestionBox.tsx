import React from "react";

interface TotalQuestionBoxProps {
    handleQuestionClick: (question: string) => void;
}

const TotalQuestionBox: React.FC<TotalQuestionBoxProps> = ({ handleQuestionClick }) => {
    const questions = [
        "아이 편식이 너무 심할때",
        "아이에게 책을 강제적으로 읽게 하는 것에 대한 오은영 박사님의 자료",
        "아이 기저귀 떼는 법"
    ];

    return (
        <div className={"pc-total-question-box"}>
            {questions.map((question, index) => (
                <div
                    key={index}
                    className={"pc-total-question"}
                    onClick={() => handleQuestionClick(question)}
                    style={{ cursor: 'pointer' }}
                >
                    {question}
                </div>
            ))}
        </div>
    );
}

export default TotalQuestionBox;