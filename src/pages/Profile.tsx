import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const dispatch = useDispatch();

    // Redux 상태에서 profileList와 selectedProfile 가져오기
    const profileList = useSelector((state: RootState) => state.profile.profiles);
    const selectedProfile = useSelector((state: RootState) => state.profile.selectedProfile);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate("/login");
            return;
        }
        fetchProfileData(jwtToken);
    }, []);

    const apiUrl = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
    const fetchProfileData = async (jwtToken: string) => {
        try {
            const response = await fetch(`${apiUrl}/api/profiles/search`, {
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
        localStorage.setItem('selectedProfile', JSON.stringify(profile));
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
