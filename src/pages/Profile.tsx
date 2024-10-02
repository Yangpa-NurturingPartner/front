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
    const [selectedProfile, setSelectedProfileState] = useState<ProfileState['selectedProfile'] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profileList = useSelector((state: RootState) => state.profile.profiles);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            // console.log("JWT token is missing");
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/api/profiles/search`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();
            dispatch(setProfiles(data));
        } catch (error) {
            // console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileAdded = () => {
        setRegis(false);
        setSelectedProfile(null);
        fetchProfileData();
    };

    const handleAddNewProfile = () => {
        setSelectedProfile(null);
        setRegis(true);
    };

    const handleSelectProfile = (profile: ProfileState['selectedProfile']) => {
        if (!profile) {
            // console.error("Selected profile is undefined or null.");
            return; // profile이 유효하지 않으면 함수 종료
        }
        localStorage.setItem('selectedProfile', JSON.stringify(profile));
        // console.log("Dispatching setSelectedProfile with profile:", profile);
        dispatch({ type: 'profile/setSelectedProfile', payload: profile }); // profile이 유효할 때만 dispatch 실행
        navigate("/");
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"pc-profile-body"}>
            <div className={"pc-profile-box"}>
                {!regis ? (
                    <ProfileChoose
                        setRegis={setRegis}
                        profileData={profileList}
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
