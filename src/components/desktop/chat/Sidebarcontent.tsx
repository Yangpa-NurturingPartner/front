import React, { useEffect, useState } from "react";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

interface ChatSummary {
    session_id: string;
    end_time: string;
    summ_answer: string;
}

interface SidebarContentProps {
    viewChatDetail: (session_id: string) => void;
    fetchChatSummaries: () => Promise<void>;
    chatSummaries: ChatSummary[];
    setChatSummaries:any;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ viewChatDetail, fetchChatSummaries,
     chatSummaries, setChatSummaries }) => {
    
    const [filteredSummaries, setFilteredSummaries] = useState<ChatSummary[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const makeSx = {
        width: "100%",
        backgroundColor: "#F4F4F4",
        borderRadius: "15px",
        border: "none",
        boxShadow: "2px 2px 5px #DADADA",
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

    useEffect(() => {
        if (searchQuery === "") {
            // 검색어가 빈 문자열이면 전체 채팅 요약본 로드
            fetchChatSummaries();
        }
    }, [searchQuery]);
    
    

    const searchChatSummaries = async () => {
        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken) {
            console.error("jwt토큰없음.");
            return;
        }

        const serverIp: string | undefined = process.env.REACT_APP_HOST;
        const port: string | undefined = process.env.REACT_APP_BACK_PORT; 

        try {
            const response = await axios.post(
                `http://${serverIp}:${port}/chat/search`,
                {
                    query: searchQuery,
                    token: "Bearer " + jwtToken,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const summaries = Array.isArray(response.data.data) ? response.data.data : [];
            setChatSummaries(summaries);
        } catch (error) {
            console.error("채팅 검색 오류:", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery) {
            searchChatSummaries(); // 검색어가 있을 때만 검색 실행
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // 날짜별로 그룹화
    const groupByDate = (summaries: ChatSummary[]) => {
        const grouped: { [key: string]: ChatSummary[] } = {};
        summaries.forEach(summary => {
            const date = new Date(summary.end_time).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(summary);
        });
        return grouped;
    };

    const groupedSummaries = groupByDate(chatSummaries);

    return (
        <div className="pc-chat-body">
        <TextField
            placeholder="히스토리 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Enter 키 입력 이벤트 추가
            variant="outlined"
            sx={{
                ...makeSx,
                '& input::placeholder': {
                    textAlign: 'center',
                },
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleSearch}> {/* 검색 버튼 클릭 이벤트 추가 */}
                            <SearchIcon style={{ color: "#999" }} />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
            <div className="pc-chat-body-searchHistory">
                {Object.entries(groupedSummaries).length > 0 ? (
                    Object.entries(groupedSummaries).map(([date, summaries]) => (
                        <div key={date}>
                            <div className="pc-chat-body-day">
                                <span>{date}</span>
                            </div>
                            {summaries.map((summary, index) => (
                                <div key={index} className="pc-chat-body-searchHistory-box" onClick={() => viewChatDetail(summary.session_id)}>
                                    <div className="pc-chat-body-roomHistory">
                                        {summary.summ_answer}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="no-records">채팅 기록이 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default SidebarContent;