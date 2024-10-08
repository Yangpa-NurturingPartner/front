import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface GobackProps {
    where: string;
}

const Goback: React.FC<GobackProps> = ({where}) => {
    const navigate = useNavigate();
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setIsTooltipVisible(false);
    };

    let ment = "";
    let tooltipStyle = {};

    if (where === "채팅") {
        ment = "채팅은 AI 기반으로, GPT와 비슷하게 간단한 대화 형식으로 육아 고민에 대한 솔루션을 쉽게 얻을 수 있게 도와줍니다.";
        tooltipStyle = { width: "22vw", height: "6vh" }; // 3줄
    } else if (where === "통합검색") {
        ment = "통합검색은 오은영 박사님의 유튜브, 블로그와 뉴스같은 문서 자료들, 커뮤니티에 작성된 글에서 최대한 비슷한 사례를 제공합니다. 그리고 이전에 채팅했던 기록에서도 비슷한 채팅이 있었다면 해당 채팅 내역도 제공합니다.";
        tooltipStyle = { width: "26vw", height: "9vh"}; // 4줄
    } else {
        ment = "커뮤니티는 부모님들끼리 서로 정보를 공유하거나 공지사항같은 게시물이 올라오는 공간입니다. 본인 아이에 맞는 정보를 찾을 수 있도록 아동의 나이에 맞는 정보들을 확인할 수 있습니다.";
        tooltipStyle = { width: "30vw", height: "7vh"}; // 4줄
    }

    const mentLines = ment.split('\n');

    return (
        <div
            style={{
                padding: "0.7rem",
                paddingBottom: "0rem",
                position: "absolute",
                zIndex: 30,
            }}
        >
            <img
                src={"/img/backIcon.png"}
                title={"뒤로가기"}
                alt="뒤로가기"
                style={{width: "0.8rem", marginRight: "1rem", cursor: "pointer"}}
                onClick={() => navigate("/")}
            />
            <span
                style={{
                    fontSize: "2.2rem",
                    fontWeight: "bold",
                    marginRight: "0.5rem",
                }}
            >
        {where}
      </span>
            <img
                src={"/img/Help.png"}
                alt="도움말"
                style={{width: "1.4rem", cursor: "pointer"}}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />

            {isTooltipVisible && (
                <div
                    style={{
                        position: "absolute",
                        backgroundColor: "rgba(247, 247, 245, 1 )",
                        left: "70%",
                        padding: "15px",
                        fontSize: "1rem",
                        borderRadius: "8px",
                        ...tooltipStyle,
                    }}
                >
                    {mentLines.map((line, index) => (
                        <div key={index} style={{ marginBottom: index === mentLines.length - 1 ? "0" : "0.5rem" }}>
                            {line}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Goback;