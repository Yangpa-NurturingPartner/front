import React from "react";
import {useNavigate} from "react-router-dom";

const SearchNavigate: React.FC = () => {

    const navigate = useNavigate();

    return (
        <div className={"pc-search-navigate"}>
            <div className={"pc-search-navigate-icon"} onClick={() => navigate("/chat")}>
                <img src={"/img/goChat.png"} alt={""} style={{width: "4.5rem"}}/>
                <span className={"pc-search-navigate-icon-title"}>채팅하기</span>
                <div className={"pc-search-navigate-icon-span"}>
                    <span>육아 고민이 있을 때</span><br/>
                    <span>양파에게 물어보세요</span>
                </div>
            </div>

            <div className={"pc-search-navigate-icon"} onClick={() => navigate("/search")}>
                <img src={"/img/goSearch.png"} alt={""}
                     style={{width: "3.8rem", marginBottom: "1.5rem", marginTop: "1rem"}}/>
                <span className={"pc-search-navigate-icon-title"}>통합검색</span>

                <div className={"pc-search-navigate-icon-span"}>
                    <br/>
                    <span>육아 자료를 검색해보세요</span><br/>
                    <span>커뮤니티 글, 영상, 문서,</span><br/>
                    <span>채팅 히스토리 등 추천드립니다.</span>
                </div>
            </div>

            <div className={"pc-search-navigate-icon"} onClick={() => navigate("/community")}>
                <img src={"/img/goCommunity.png"} alt={""} style={{width: "5rem"}}/>
                <span className={"pc-search-navigate-icon-title"}>커뮤니티</span>
                <div className={"pc-search-navigate-icon-span"}>
                    <span>다른 사람들과 고민을</span><br/>
                    <span> 공유해보세요</span>
                </div>
            </div>
        </div>
    )
}

export default SearchNavigate;