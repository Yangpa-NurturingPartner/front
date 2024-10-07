import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SearchPart from "../components/desktop/main/SearchPart";
import "../css/mainCsss.scss";
import SearchNavigate from "../components/desktop/main/SearchNavigate";

  const Main: React.FC = () => {
    const [query, setQuery] = useState<string>(''); 
    const navigate = useNavigate();
    const [showAsk, setShowAsk] = useState(false);


    // 질문을 채팅 페이지로 보냄
    const handleMainQuery = (query: string) => { 
        console.log("질문 제출:", query);
        localStorage.setItem("mainQuery", query);
        setQuery(query);
        setShowAsk(false);
        navigate('/chat', { state: { query } });
    };
    

    return (
        <div className={"pc-mainpage"}>
            <SearchPart MainQuery={handleMainQuery} />
            <SearchNavigate />
        </div>
    );
};

export default Main;
