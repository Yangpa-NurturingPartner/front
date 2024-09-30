import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/profileCss.scss";
import "../css/profileadd.scss";
import ProfileChoose from "../components/desktop/profile/ProfileChoose";
import ProfileAddOrRegist from "../components/desktop/profile/ProfileAddOrRegist";

interface ProfileData {
    childId: number;
    name: string;
    sex: number;
    birthdate: string;
    imageProfile: string;
}

const Profile: React.FC = () => {
    const [regis, setRegis] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfileData();
    }, [navigate]);

    const fetchProfileData = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const email = localStorage.getItem('email');

        if (!jwtToken || !email) {
            console.log("JWT token or email is missing");
            navigate("/login");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/profiles/${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                console.log("Unauthorized - redirecting to login");
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('email');
                navigate("/login");
                return;
            }

            if (response.status === 403) {
                console.log("Forbidden - check user permissions or token validity");
                throw new Error('Forbidden access');
            }

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data: ProfileData[] = await response.json();
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            setError('Error fetching profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileAdded = () => {
        setRegis(false);
        setSelectedProfile(null); // 등록 모드로 돌아갈 때 프로필 정보를 초기화
        fetchProfileData();
    };

    const handleAddNewProfile = () => {
        setSelectedProfile(null); // 새 프로필 추가 시 프로필 정보를 초기화
        setRegis(true);
    };

    const handleSelectProfile = (profile: ProfileData) => {
        // 선택된 프로필 정보를 Local Storage에 저장
        console.log('Selected Profile: ', profile);
        localStorage.setItem('selectedProfile', JSON.stringify(profile));

        // 메인 화면 또는 다른 화면으로 이동
        navigate("/"); // 원하는 경로로 수정
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={"pc-profile-body"}>
            <div className={"pc-profile-box"}>
                {!regis ? (
                    <ProfileChoose
                        setRegis={setRegis}
                        profileData={profileData}
                        setSelectedProfile={setSelectedProfile}
                        onAddNewProfile={handleAddNewProfile}
                        onSelectProfile={handleSelectProfile}
                    />
                ) : (
                    <ProfileAddOrRegist
                        setRegis={setRegis}
                        onProfileAdded={handleProfileAdded}
                        selectedProfile={selectedProfile}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
