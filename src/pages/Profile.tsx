import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/profileCss.scss";
import "../css/profileadd.scss";
import ProfileChoose from "../components/desktop/profile/ProfileChoose";
import ProfileAddOrRegist from "../components/desktop/profile/ProfileAddOrRegist";

const Profile: React.FC = () => {
    const [regis, setRegis] = useState(false);
    const [profileData, setProfileData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenExpiration = () => {
            const expiration = localStorage.getItem('tokenExpiration');
            if (expiration && new Date(expiration) < new Date()) {
                navigate("/login");
                return false;
            }
            return true;
        };

        if (checkTokenExpiration()) {
            fetchProfileData();
        }
    }, [navigate]);

    const fetchProfileData = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const email = localStorage.getItem('email');

        if (!jwtToken || !email) {
            console.log("JWT token or email is missing");
            navigate("/login");
            return;
        }

        // JWT 토큰의 만료 시간 확인
        const isTokenExpired = () => {
            const tokenPayload = JSON.parse(atob(jwtToken.split('.')[1]));  // JWT 토큰의 페이로드 부분을 디코딩
            const currentTime = Math.floor(Date.now() / 1000);  // 현재 시간을 초 단위로 가져오기
            return tokenPayload.exp < currentTime;  // 만료 시간과 현재 시간을 비교
        };

        // 토큰이 만료되었으면 로그아웃 처리
        if (isTokenExpired()) {
            console.log("JWT token has expired");
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('email');
            navigate("/login");
            return;
        }

        // JWT 토큰을 이용해 백엔드 API 호출
        try {
            const response = await fetch(`http://localhost:8080/api/profiles/${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // 인증 정보 포함
            });

            if (response.status === 401) {
                console.log("Unauthorized - redirecting to login");
                localStorage.removeItem('jwtToken');  // 로그아웃 시 JWT 토큰 제거
                localStorage.removeItem('email');  // 이메일 정보 제거
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();
            setProfileData(data);  // 성공적으로 프로필 데이터를 받으면 상태에 저장
        } catch (error) {
            console.error('Error fetching profile data:', error);
            setError('Error fetching profile data');
        }
    };

    const handleProfileAdded = () => {
        setRegis(false);  // 프로필 추가 후 다시 프로필 선택 화면으로 돌아가기
        fetchProfileData();  // 프로필 데이터를 다시 가져옴
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={"pc-profile-body"}>
            <div className={"pc-profile-box"}>
                {!regis ? (
                    <ProfileChoose setRegis={setRegis} profileData={profileData} />
                ) : (
                    <ProfileAddOrRegist setRegis={setRegis} onProfileAdded={handleProfileAdded} />
                )}
            </div>
        </div>
    );
};

export default Profile;
