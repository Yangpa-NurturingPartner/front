import React from "react";

const ChatPartDefault: React.FC = () => {

    return (
        <div className={"pc-ask"}>
            <span className={"pc-ask-title"}>육아 고민을 AI에게 물어보세요</span>
            <div className={"pc-ask-question-box"}>
                <div className={"pc-ask-question"}><span>애기가 편식을 너무 심하게 해</span></div>
                <div className={"pc-ask-question"}><span>책을 어떻게 읽어 줘야 할까</span></div>
                <div className={"pc-ask-question"}><span>오은영 10계명 알려줘</span></div>
            </div>
        </div>
    );
}

export default ChatPartDefault;