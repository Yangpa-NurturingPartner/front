import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
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
        }
    };

    useEffect(() => {
        const fetchChatSummaries = async () => {
            try {
                //임시
                const user_id = "kim123";

                const sessionIdsResponse = await axios.post('http://localhost:8080/chat/get-userinfo', { user_id });
                const sessionIds = sessionIdsResponse.data;

                console.log("세션아이디:", sessionIds);

                if (!sessionIds || sessionIds.length === 0) {
                    console.warn("세션 아이디가 없습니다.");
                    return;
                }

                //채팅 요약 불러오기
                const response = await axios.post('http://localhost:8080/chat/chat-record', sessionIds);
                setChatSummaries(response.data); 
                setFilteredSummaries(response.data); 
            } catch (error) {
                console.error('채팅 요약 불러오기 오류:', error);
            }
        };

        fetchChatSummaries();
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

    return (
        <div className="pc-chat-body">
            <TextField
                id="outlined-basic"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label="히스토리 검색"
                variant="outlined"
                sx={{ ...makeSx, width: '80%', padding: '0.2rem' }}
                InputProps={{
                    endAdornment: (
                        <img className={"pc-chat-icon"} src={"/img/search.png"} alt={""} style={{ width: "1.5rem" }} />
                    ),
                }}
            />
            <div className="pc-chat-body-searchHistory">
                {filteredSummaries.length > 0 ? (
                    filteredSummaries.map((summary, index) => (
                    <div key={index} className="pc-chat-body-searchHistory-box" onClick={() => viewChatDetail(summary.session_id)}>
                        <div className="pc-chat-body-day">
                        <span>{new Date(summary.end_time).toLocaleDateString()}</span>
                        </div>
                        <div className="pc-chat-body-roomHistory">
                        {summary.summ_answer}
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="no-records">채팅 기록이 없습니다.</div>
                )}
            </div>
        </div>
    )
};
export default SidebarContent;
