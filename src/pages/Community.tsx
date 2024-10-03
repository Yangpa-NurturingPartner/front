import React, {useState} from "react";
import Goback from "../components/common/Goback";
import "../css/commCss.scss";
import CommHeader from "../components/desktop/comm/CommHeader";
import {Pagination} from "@mui/material";
import CommContent from "../components/desktop/comm/CommContent";
import CommWrite from "../components/desktop/comm/CommWrite";
import {Outlet, useLocation} from "react-router-dom";
import {useCommunity} from "../hook/useCommunity";

const Community: React.FC = () => {

    const location = useLocation();
    const isRootPath = location.pathname === "/community";

    // useCommunity 훅에서 데이터, 로딩 상태, 에러 가져오기
    const {
        write, setWrite,
        communityData, loading,
        error, pageCount,
        selectedPage, setSelectedPage,
        selectedList, setSelectedList,
        selectedPeriod, setSelectedPeriod,
        searchUserQuery,
        selectedBoardCode, setSelectedBoardCode,
        title, setTitle,
        content, setContent,
        file, setFile, writeBoard, resetWrite
    } = useCommunity();

    return (
        <div>
            <Goback where={"커뮤니티"}/>
            <div className={"pc-comm-body"}>
                <CommHeader
                    write={write}
                    setWrite={setWrite}
                    selectedList={selectedList}
                    setSelectedList={setSelectedList}
                    setSelectedPage={setSelectedPage}
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                    searchUserQuery={searchUserQuery}
                    resetWrite={resetWrite}
                />

                {write ? (
                    <CommWrite
                        setWrite={setWrite}
                        selectedBoardCode={selectedBoardCode}
                        setSelectedBoardCode={setSelectedBoardCode}
                        title={title} setTitle={setTitle}
                        content={content} setContent={setContent}
                        file={file} setFile={setFile} writeBoard={writeBoard}
                        resetWrite={resetWrite}
                    />
                ) : (
                    <>
                        {!isRootPath ? (
                            <Outlet/>
                        ) : (
                            <>
                                {loading ? (
                                    <p>로딩 중...</p>
                                ) : error ? (
                                    <p>{error}</p>
                                ) : (
                                    <CommContent
                                        data={communityData}
                                    />
                                )}
                                <Pagination
                                    count={pageCount}
                                    color="primary"
                                    sx={{marginTop: "3rem"}}
                                    page={selectedPage}
                                    onChange={(e: React.ChangeEvent<unknown>, value: number) => setSelectedPage(value)}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Community;