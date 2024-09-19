import React, {useState} from "react";
import Sidebar from "../components/desktop/chat/Sidebar";
import "../css/chatCss.scss";
import {useMediaQuery} from "react-responsive";
import {TextField} from "@mui/material";
import ChatContent from "../components/desktop/chat/ChatContent";

const Chatting: React.FC = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const isPortrait = useMediaQuery({query: '(orientation: portrait)'});

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <>
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar}/>
            <div
                className={`content-container ${isSidebarCollapsed ? "collapsed" : "expanded"}`}>
                <ChatContent/>
            </div>
        </>
    );
};

export default Chatting;
