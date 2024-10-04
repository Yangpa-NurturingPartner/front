import React from "react";
import {useNavigate} from "react-router-dom";

interface CommContentProps {
    data: any[];
}

const CommContent: React.FC<CommContentProps> = ({data}) => {
    const navigate = useNavigate();

    const handleClick = (id: string) => {
        navigate(`/community/${id}`);
    };

    // 글자수 제한 함수
    const truncateText = (text: string, length: number) => {
        if (text.length > length) {
            return text.slice(0, length) + '...';
        }
        return text;
    };

    return (
        <div className={"pc-comm-result-box"}>
            {data.map((item: any, index: number) => {
                return (
                    <div
                        key={index}
                        className={"pc-comm-result"}
                        onClick={() => handleClick(item.board_no)}
                        id={item.board_no}
                    >
                        <div className={"pc-comm-result-text"}>
                            <p className={"pc-comm-result-title"}>{item.title}</p>
                            <span className={"pc-comm-result-content"}>
                            {truncateText(item.board_contents, 50)}
                        </span>
                        </div>
                        {
                            item.imageUrl === null
                                ? <></>
                                : <img
                                    className={"pc-comm-result-img"}
                                    src={item.imageUrl}
                                    alt={item.title}
                                />
                        }
                    </div>
                )
            })}
        </div>
    );
};

export default CommContent;