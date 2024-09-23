import React, { useState, useEffect } from "react";
import Goback from "../components/common/Goback";
import "../css/commCss.scss";
import CommHeader from "../components/desktop/comm/CommHeader";
import { Pagination } from "@mui/material";
import CommContent from "../components/desktop/comm/CommContent";
import CommWrite from "../components/desktop/comm/CommWrite"; // 이 부분 추가
import { Outlet, useLocation } from "react-router-dom";

const Community: React.FC = () => {
    const [write, setWrite] = useState(false);
    const [page, setPage] = useState(1); // 페이지 상태

    const location = useLocation();
    const isRootPath = location.pathname === '/community';

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div>
            <Goback where={"커뮤니티"} />
            <div className={"pc-comm-body"}>
                <CommHeader write={write} setWrite={setWrite} />

                {write ? (
                    <CommWrite setWrite={setWrite} /> 
                ) : (
                    <>
                        {!isRootPath ? (
                            <Outlet />
                        ) : (
                            <>
                                <CommContent />
                                <Pagination
                                    count={10} // 페이지 수
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    sx={{ marginTop: "3rem" }}
                                />
                            </>
                        )}
                    </>
                )
                }
            </div>
        </div>
    );
};

export default Community;