import React from "react";
import Goback from "../../common/Goback";
import SidebarContent from "./Sidebarcontent";

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    viewChatDetail: (session_id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, viewChatDetail }) => {
    
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
                <img
                    src={"/img/write.png"}
                    alt={""}
                    style={{
                        cursor: "pointer",
                        position: "absolute",
                        left: isCollapsed ? '4vw' : '17vw',
                        bottom: "0.2vh",
                        transition: "left 0.3s ease"
                    }}
                />
            </div>
        </>
    );
};

export default Sidebar;


