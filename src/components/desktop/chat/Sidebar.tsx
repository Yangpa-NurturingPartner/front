import React from "react";
import { useNavigate } from "react-router-dom"; 
import Goback from "../../common/Goback";
import SidebarContent from "./Sidebarcontent";

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    viewChatDetail: (session_id: string) => void;
    endSession: () => void;
    endstartChat: () => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, viewChatDetail, endstartChat, endSession }) => {
    const navigate = useNavigate();
    
    return (
        <>
            <Goback where={"채팅"} />
            <div className={`pc-chat-sidebar ${isCollapsed ? "collapsed" : ""}`}>
                {!isCollapsed && <SidebarContent viewChatDetail={viewChatDetail} />}
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
                        await endSession(); //기존 채팅 종료
                        await endstartChat(); //새로운 채팅 시작
                        navigate("/chat"); // 메인 채팅 페이지로 이동
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
