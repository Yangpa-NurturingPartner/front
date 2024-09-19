import React from "react";

const ChatCloud: React.FC = () => {
    return (
        <div className={"pc-chat-cloud-body"}>
            <div className={"pc-chat-cloud-question-box"}>
                <div className={"pc-chat-cloud-question"}>
                    <span>질문 질문 질문</span>
                </div>
            </div>

            <div className={"pc-chat-cloud-answer"}>
                <span>대답 대답 대답</span>
            </div>

        </div>
    );
}

export default ChatCloud;