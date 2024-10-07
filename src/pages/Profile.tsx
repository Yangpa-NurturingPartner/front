import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setProfiles, setSelectedProfile, ProfileState } from '../redux/slices/profileSlice';
import "../css/profileCss.scss";
import "../css/profileadd.scss";
import ProfileChoose from "../components/desktop/profile/ProfileChoose";
import ProfileAddOrRegist from "../components/desktop/profile/ProfileAddOrRegist";

const Profile: React.FC = () => {
    const [regis, setRegis] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const CryptoJS = require('crypto-js');

    // Redux 상태에서 profileList와 selectedProfile 가져오기
    const profileList = useSelector((state: RootState) => state.profile.profiles);
    const selectedProfile = useSelector((state: RootState) => state.profile.selectedProfile);

    const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

    // 암호화 함수
    const encryptData = (data: string) => {
        return CryptoJS.AES.encrypt(data, encryptionKey).toString();
    };

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate("/login");
            return;
        }
        fetchProfileData(jwtToken);

        const queryParams = new URLSearchParams(location.search);
        const action = queryParams.get('action');

        if (action === 'edit' && selectedProfile) {
            setRegis(true);
        } else if (action === 'add') {
            setRegis(true);
        }
        // console.log("Redux selectedProfile:", selectedProfile);
    }, [location.search]);

    const serverIp: string | undefined = process.env.REACT_APP_HOST;
    const port: string | undefined = process.env.REACT_APP_BACK_PORT;
    const fetchProfileData = async (jwtToken: string) => {
        try {
            const response = await fetch(`http://${serverIp}:${port}/api/profiles/search`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();

            if (Array.isArray(data.data)) {
                dispatch(setProfiles(data.data));
            } else {
                console.error('Fetched data does not contain an array:', data);
                dispatch(setProfiles([]));
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            dispatch(setProfiles([]));
        }
    };

    const handleProfileAdded = () => {
        setRegis(false);
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) fetchProfileData(jwtToken);
    };

    const handleAddNewProfile = () => {
        dispatch(setSelectedProfile(null)); // Redux 상태로 설정
        setRegis(true);
    };

    const handleSelectProfile = (profile: ProfileState['selectedProfile']) => {
        if (!profile) return;

        // Redux에 selectedProfile 설정
        dispatch(setSelectedProfile(profile));

        // 선택된 프로필을 암호화하여 로컬 스토리지에 저장
        const encryptedProfile = encryptData(JSON.stringify(profile));
        localStorage.setItem('selectedProfile', encryptedProfile);

        navigate("/");
    };

    return (
        <div className={"pc-profile-body"}>
            <div className={"pc-profile-box"}>
                {!regis ? (
                    <ProfileChoose
                        setRegis={setRegis}
                        profileData={Array.isArray(profileList) ? profileList : []}
                        setSelectedProfile={(profile) => dispatch(setSelectedProfile(profile))} // Redux로 상태 설정
                        onAddNewProfile={handleAddNewProfile}
                        onSelectProfile={handleSelectProfile}
                    />
                ) : (
                    <ProfileAddOrRegist
                        setRegis={setRegis}
                        onProfileAdded={handleProfileAdded}
                        selectedProfile={selectedProfile} // Redux에서 가져온 selectedProfile 전달
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
