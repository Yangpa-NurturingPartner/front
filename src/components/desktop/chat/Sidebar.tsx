import React from "react";
import Goback from "../../common/Goback";
import SidebarRoom from "./SidebarRoom";

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({isCollapsed, toggleSidebar}) => {
    return (
        <>
            <Goback where={"채팅"}/>
            <div className={`pc-chat-sidebar ${isCollapsed ? "collapsed" : ""}`}>
                {!isCollapsed && (
                    <SidebarRoom/>
                )}
            </div>
            <div className={"pc-chat-sidebar-btn"}>
                <img
                    src={"/img/spreadbtn.png"}
                    alt={""}
                    onClick={toggleSidebar}
                    style={{cursor: "pointer"}}
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