import React from "react";

const TotalResult: React.FC = () => {
    return (
        <div className={"pc-total-result-box"}>
            <div className={"pc-total-result-2"}>
                <div className={"pc-total-result-1"}>
                    <span>관련 문서</span>
                    <div className={"pc-total-search-list"}>
                        <div>1. 문서 검색 내용</div>
                        <div>2. 문서 검색 내용</div>
                        <div>3. 문서 검색 내용</div>
                    </div>
                </div>

                <div className={"pc-total-result-1"}>
                    <span>관련 영상</span>
                    <div className={"pc-total-search-list"}>
                        <img src={"/img/mainPaint.png"} alt={""}/>
                    </div>
                </div>
            </div>

            <div className={"pc-total-result-2"}>
                <div className={"pc-total-result-1"}>
                    <span>커뮤니티</span>
                    <div className={"pc-total-search-list"}>
                        <div>1. 커뮤니티 검색 내용</div>
                        <div>2. 커뮤니티 검색 내용</div>
                        <div>3. 커뮤니티 검색 내용</div>
                    </div>
                </div>

                <div className={"pc-total-result-1"}>
                    <span>예전 채팅</span>
                    <div className={"pc-total-search-list"}>
                        <div>1. 예전 채팅</div>
                        <div>2. 예전 채팅</div>
                        <div>3. 예전 채팅</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TotalResult;