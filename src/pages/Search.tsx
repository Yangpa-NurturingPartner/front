import React, { useState, useEffect } from "react";
import Goback from "../components/common/Goback";
import "../css/totalSearchCss.scss"
import { TextField } from "@mui/material";
import TotalQuestionBox from "../components/desktop/totalSearch/TotalQuestionBox";
import TotalResult from "../components/desktop/totalSearch/TotalResult";
import { totalSearchResult } from "../apis/TotalSearchApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { clearSearchResults } from "../redux/slices/totalSearchSlice";

const TotalSearch: React.FC = () => {
    const [find, setFind] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const isLoading = useSelector((state: RootState) => state.totalSearch.isLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        // 컴포넌트가 언마운트될 때 상태 초기화
        return () => {
            setFind(false);
            setSearchQuery('');
            setSubmittedQuery('');
            dispatch(clearSearchResults());
        };
    }, [dispatch]);

    const handleSearch = async () => {
        if (searchQuery.trim() !== '') {
            setFind(true);
            setSubmittedQuery(searchQuery);
            dispatch(totalSearchResult(searchQuery) as any);
        }
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleQuestionClick = async (query: string) => {
        setSearchQuery(query);
        setSubmittedQuery(query);
        setFind(true);
        dispatch(totalSearchResult(query) as any);
    };

    const makeSx = {
        backgroundColor: "white",
        width: "100%",
        borderRadius: "15px",
        border: "2px solid #0B64C0",
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                border: "none",
            },
            "&:hover fieldset": {
                border: "none",
            },
            "&.Mui-focused fieldset": {
                border: "none",
            },
            borderRadius: "15px",
        },
        "& .MuiInputLabel-root": {
            color: "rgb(AAAAAA)",
            "&.Mui-focused": {
                display: "none",
                color: "black",
            },
        },
    };

    return (
        <>
            <Goback where={"통합검색"} />

            <div className={"pc-total-body"}>
                <span className={"pc-total-title"}>육아 자료를 검색해 보세요</span>
                {
                    find ? <></>
                        : <span className={"pc-total-subtitle"}>관련 문서, 영상, 커뮤니티 글을 제공해드립니다!</span>
                }

                <div className={"pc-total-search"}>
                    <TextField
                        id="outlined-basic"
                        placeholder="검색할 자료를 입력하세요"
                        variant="outlined"
                        sx={makeSx}
                        value={searchQuery}  // 이 줄 추가
                        InputProps={{
                            endAdornment: (
                                <img
                                    src={"/img/search.png"}
                                    alt={""}
                                    style={{ width: "2rem", cursor: "pointer" }}
                                    onClick={handleSearch}
                                />
                            ),
                        }}
                        onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyPress(e)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>

                {
                    find ? <TotalResult searchQuery={submittedQuery} isLoading={isLoading} />
                        : <TotalQuestionBox handleQuestionClick={handleQuestionClick} />
                }
            </div>
        </>
    );
}

export default TotalSearch;