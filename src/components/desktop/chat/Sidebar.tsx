import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Goback from "../../common/Goback";
import SidebarContent from "./Sidebarcontent";

interface ChatSummary {
    session_id: string;
    end_time: string;
    summ_answer: string;
}


interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    viewChatDetail: (session_id: string) => void;
    endSession: () => void;
    endstartChat: () => void; 
    showChatDetail: boolean;
    setShowChatDetail: (value: boolean) => void; 
    showAsk: boolean;
    setShowAsk: (value: boolean) => void; 
    fetchChatSummaries: () => Promise<void>;
    chatSummaries: ChatSummary[];
    setChatSummaries:any;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, viewChatDetail,endstartChat, endSession, fetchChatSummaries, chatSummaries, setChatSummaries }) => {
    const navigate = useNavigate();
    const [showChatDetail, setShowChatDetail] = useState(false);
    const [showAsk, setShowAsk] = useState(true);
    
    return (
        <>
            <Goback where={"채팅"} />
            <div className={`pc-chat-sidebar ${isCollapsed ? "collapsed" : ""}`}>
                {!isCollapsed && <SidebarContent viewChatDetail={viewChatDetail} fetchChatSummaries={fetchChatSummaries}
                 chatSummaries={chatSummaries} setChatSummaries={setChatSummaries}/>}
            </div>
            <div className={"pc-chat-sidebar-btn"}>
                <img
                    src={"/img/spreadbtn.png"}
                    alt={""}
                    onClick={toggleSidebar}
                    style={{ cursor: "pointer" }}
                />
                <div className={"pc-chat-sidebar-btn-newchat"}>
            <img
                src={"/img/write.png"}
                alt={""}
                onClick={async () => {
                    navigate('/chat', { state: { showAsk: true } });
                    setShowChatDetail(false);
                    setShowAsk(true);
                    await endSession(); // 기존 채팅 종료
                }}
                style={{
                    cursor: "pointer",
                    position: "absolute",
                    left: isCollapsed ? '4vw' : '13vw',
                    bottom: "0.2vh",
                    transition: "left 0.3s ease"
                }}
            />
        </div>

            </div>
        </>
    );
};

export default Sidebar;
