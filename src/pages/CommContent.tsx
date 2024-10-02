import React, {useState, useRef} from "react";
import Button from "@mui/material/Button";
import {useNavigate, useParams} from "react-router-dom";
import CommContentComments from "../components/desktop/comm/content/CommContentComments";
import CommContentShow from "../components/desktop/comm/content/CommContentShow";
import {useCommunity} from "../hook/useCommunity";

export const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

export const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const CommContent: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const boardId = parseInt(id || "0", 10);

    // useCommunity에 boardId 전달하여 상세 게시물 가져오기
    const {
        communityData, loading, error, fetchCommunityData
    } = useCommunity(boardId);

    // 데이터 로딩 및 에러 처리
    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    // 게시물 데이터, 댓글 데이터 분리
    const {board, comments}: any = communityData;

    return (
        <div className={"pc-comm-content-body"}>
            <CommContentShow board={board}/>
            <CommContentComments
                comments={comments}
                boardId={boardId}
                fetchComments={fetchCommunityData}
            />
        </div>
    );
};

export default CommContent;