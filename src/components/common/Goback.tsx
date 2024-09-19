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

    if (where === "채팅")
        ment = "채팅은 AI 기반으로, GPT와 비슷하게 간단한 대화 형식으로 육아 고민에 대한 솔루션을 쉽게 얻을 수 있게 도와줍니다.";
    else if (where === "통합검색") ment = "통합검색은 \n오은영 박사님의 유튜브, 블로그와 뉴스같은 문서 자료들, 커뮤니티에 작성된 글에서 최대한 비슷한 사례를 제공합니다.\n 그리고 이전에 채팅했던 기록에서도 비슷한 채팅이 있었다면 해당 채팅 내역도 제공합니다.";
    else ment = "커뮤니티는 \n부모님들끼리 서로 정보를 공유하거나\n 공지사항같은 게시물이 올라오는 공간입니다.\n 본인 아이에 맞는 정보를 찾을 수 있도록 아동의 나이에 맞는 정보들을 확인할 수 있습니다.";

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
                onClick={() => navigate(-1)}
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
                alt=""
                style={{width: "1.4rem", cursor: "pointer"}}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />

            {isTooltipVisible && (
                <div
                    style={{
                        position: "absolute",
                        backgroundColor: "rgba(217, 217, 217, 1 )",
                        left: "70%",
                        width: "20vw",
                        height: "18vh",
                        padding: "15px",
                        fontSize: "1rem",
                        borderRadius: "8px",
                    }}
                >
                    {mentLines.map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Goback;