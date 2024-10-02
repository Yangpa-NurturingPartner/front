import React, { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

interface ChatSummary {
    session_id: string;
    end_time: string;
    summ_answer: string;
}

interface SidebarContentProps {
    viewChatDetail: (session_id: string) => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ viewChatDetail }) => {
    const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([]);
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
        const jwtToken = "Bearer " + localStorage.getItem("jwtToken");
        const fetchChatSummaries = async () => {
            try {
                const response = await axios.post('http://localhost:8000/chat/user-chat-record', {}, {
                    headers: {
                        'Authorization': jwtToken,
                        'Content-Type': 'application/json'
                    }
                });

                const summaries = Array.isArray(response.data) ? response.data : [];
            
                setChatSummaries(summaries);
                console.log(summaries);
                setFilteredSummaries(summaries);
            } catch (error) {
                console.error('채팅 요약 불러오기 오류:', error);
            }
        };
    
        fetchChatSummaries(); // 초기 데이터 로딩
    
        //5초마다 주기적으로 호출
        //const intervalId = setInterval(fetchChatSummaries, 5000); 
        //return () => clearInterval(intervalId);
    }, []);
    

    useEffect(() => {
        const filterItems = () => {
            if (searchQuery) {
                setFilteredSummaries(chatSummaries.filter(summary =>
                    summary.summ_answer.toLowerCase().includes(searchQuery.toLowerCase())
                ));
            } else {
                setFilteredSummaries(chatSummaries);
            }
        };

        filterItems();
    }, [searchQuery, chatSummaries]);

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

    const groupedSummaries = groupByDate(filteredSummaries);

    return (
        <div className="pc-chat-body">
            <TextField
                placeholder="히스토리 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                            <SearchIcon style={{ color: "#999" }} />
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
