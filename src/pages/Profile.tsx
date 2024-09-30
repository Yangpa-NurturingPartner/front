import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setProfiles, setSelectedProfile } from '../redux/slices/profileSlice';
import "../css/profileCss.scss";
import "../css/profileadd.scss";
import ProfileChoose from "../components/desktop/profile/ProfileChoose";
import ProfileAddOrRegist from "../components/desktop/profile/ProfileAddOrRegist";

const Profile: React.FC = () => {
    const dispatch = useDispatch();
    const profileData = useSelector((state: RootState) => state.profile.profiles);
    const selectedProfile = useSelector((state: RootState) => state.profile.selectedProfile);
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

        try {
            const response = await fetch(`http://localhost:8080/api/profiles/${email}`, {
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
            console.error('Error fetching profile data:', error);
        }
    };

    const handleProfileAdded = () => {
        fetchProfileData();
    };

    const handleSelectProfile = (profile: any) => {
        dispatch(setSelectedProfile(profile));
        navigate("/");
    };

    return (
        <div className={"pc-profile-body"}>
            <div className={"pc-profile-box"}>
                {!selectedProfile ? (
                    <ProfileChoose
                        setRegis={() => {}}
                        profileData={profileData}
                        setSelectedProfile={() => {}}
                        onAddNewProfile={() => {}}
                        onSelectProfile={handleSelectProfile}
                    />
                ) : (
                    <ProfileAddOrRegist
                        setRegis={() => {}}
                        onProfileAdded={handleProfileAdded}
                        selectedProfile={selectedProfile}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
