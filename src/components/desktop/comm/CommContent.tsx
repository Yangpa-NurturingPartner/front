import React from "react";
import {useNavigate} from "react-router-dom";

const CommContent: React.FC = () => {

    const navigate = useNavigate();

    const handleClick = (id: string) => {
        navigate(`/community/${id}`);
    };

    return (
        <div className={"pc-comm-result-box"}>
            {
                Array.from({length: 5}).map((_, index: number) => {
                    return (
                        <div className={"pc-comm-result"} onClick={() => handleClick(index.toString())}>
                            <div className={"pc-comm-result-text"}>
                                <p className={"pc-comm-result-title"}>자녀 장려금 신청 못했다면?</p>
                                <span className={"pc-comm-result-content"}>2024 자녀장려금 지급은 언제일까? 2024 자녀장려금 지급일부터 기한후 신청방법까지, 한 눈에 정리했어요.</span>
                            </div>
                            <img className={"pc-comm-result-img"} src={"/img/mainPaint.png"} alt={""}/>
                        </div>
                    )
                })
            }

        </div>
    );
}

export default CommContent;