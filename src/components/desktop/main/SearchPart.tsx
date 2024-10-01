import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { TextField, IconButton } from "@mui/material";

interface SearchPartProps {
    MainQuery: (question: string) => void; // 질문 제출 함수
}

const SearchPart: React.FC<SearchPartProps> = ({ MainQuery }) => {
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const [query, setQuery] = useState(''); // 질문 상태 관리

    const makeSx = {
        backgroundColor: "white",
        borderRadius: "15px",
        border: "none",
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

    const handleMainQuery = () => {
        if (query.trim()) {
            MainQuery(query); // 질문 제출 함수 호출
            setQuery(''); // 질문 입력 초기화
        }
    };

    return (
        <>
            <div className={isPortrait ? "ph-hands-img-div" : "pc-hands-img-div"}>
                <img className={isPortrait ? "ph-hands-img" : "pc-hands-img"} src="/img/hands.png" alt={""} />
            </div>

            {
                isPortrait
                    ? <></>
                    : <div className={"pc-search-input-box"}>
                        <span className={"pc-search-input-title"}>내 손안의 양육 파트너 : 양파</span>
                        <TextField
                            id="outlined-basic"
                            placeholder="육아 고민 AI에게 물어보기"
                            variant="outlined"
                            sx={makeSx}
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} // query 값을 설정
                            onKeyUp={(e: any) => {
                                if (e.key === "Enter") {
                                    handleMainQuery(); // Enter 키가 눌리면 handleMainQuery 호출
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleMainQuery}>
                                        <img className={"pc-search-icon"} src={"/img/search.png"} alt={""} />
                                    </IconButton>
                                ),
                            }}
                        />
                    </div>
            }
        </>
    );
}

export default SearchPart;
