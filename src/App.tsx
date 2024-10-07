import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Main from "./pages/Main";
import Login from "./pages/Login";
import Testpage from "./pages/Testpage";
import Header from "./components/common/header/Header";
import Chatting from "./pages/Chatting";
import Community from "./pages/Community";
import CommContent from "./pages/CommContent";
import TotalSearch from "./pages/Search";
import Profile from "./pages/Profile";

const App: React.FC = () => {
    const location = useLocation();

    const token = localStorage.getItem('jwtToken');

    // 토큰 유무에 따라 리다이렉트 처리
    // 1. 토큰이 없고 주소가 로그인 페이지 일 경우
    if (!token && location.pathname !== '/login') {
        return <Navigate to="/login" replace />;

        // 2. 토큰이 있고 주소가 로그인 페이지 일 경우
    } else if (token && location.pathname === '/login') {
        return <Navigate to="/profile" replace />;

        // 3. 토큰이 있는데 주소가 로그인이 아닐경우
    } else if (token && location.pathname !== '/profile' && !localStorage.getItem('selectedProfile')) {
        return <Navigate to="/profile" replace />;
    }
    
    return (
        <div style={{ margin: 0 }}>
            {location.pathname !== '/login' && location.pathname !== '/profile' && <Header />}
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/test" element={<Testpage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat" element={<Chatting />} />
                <Route path="/community" element={<Community />}>
                    <Route path=":id" element={<CommContent />} />
                </Route>
                <Route path="/search" element={<TotalSearch />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
    );
};

export default App;
