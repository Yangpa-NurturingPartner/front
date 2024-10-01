import React, {useState} from "react";
import Goback from "../components/common/Goback";
import "../css/totalSearchCss.scss"
import {TextField} from "@mui/material";
import TotalQuestionBox from "../components/desktop/totalSearch/TotalQuestionBox";
import TotalResult from "../components/desktop/totalSearch/TotalResult";
import { getTotalSearchResult } from "../apis/TotalSearchApiCalls";
import { useDispatch , useSelector } from "react-redux";
import { useEffect } from "react";

const TotalSearch: React.FC = () => {

    const [find, setFind] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (find) {
            dispatch(getTotalSearchResult(searchQuery));
        }
    }, [dispatch, searchQuery, find]);
    
    const handleSearch = () => {
        setFind(true); // 검색 결과를 보여주기 위해 find를 true로 설정
    };
    
    const handleKeyPress = (event: any) => {
        if (event === 'Enter') {
            setFind(!find);
            handleSearch()
        }
    };

    const makeSx = {
        backgroundColor: "white",
        width: "100%",
        borderRadius: "15px",
        border: "1px solid #0B64C0",
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
            <Goback where={"통합검색"}/>

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
                        InputProps={{
                            endAdornment: (
                                <img 
                                    src={"/img/search.png"} 
                                    alt={""} 
                                    style={{width: "2rem", cursor: "pointer"}} 
                                    onClick={handleSearch}
                                />
                            ),
                        }}
                        onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyPress(e.key)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>

                {
                    find ? <TotalResult/>
                        : <TotalQuestionBox/>
                }
            </div>
        </>
    );
}

export default TotalSearch;