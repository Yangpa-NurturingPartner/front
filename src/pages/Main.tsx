import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchPart from "../components/desktop/main/SearchPart";
import "../css/mainCsss.scss";
import SearchNavigate from "../components/desktop/main/SearchNavigate";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Main: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const navigate = useNavigate();
    const CryptoJS = require('crypto-js');
    const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;
 
    // 복호화 함수
    const decryptData = (cipherText: string) => {
        if (!encryptionKey) {
            console.error('Encryption key is not set. Cannot decrypt data.');
            return null; // 키가 없을 때 null 반환
        }
        try {
            const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Failed to decrypt data:', error);
            return null;
        }
    };


    // 질문을 채팅 페이지로 보냄
    const handleMainQuery = (query: string) => {
        console.log("질문 제출:", query);
        setQuery(query);
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
