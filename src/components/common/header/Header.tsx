import React, { useEffect } from 'react';
import { useMediaQuery } from "react-responsive";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { setProfiles, setSelectedProfile } from '../../../redux/slices/profileSlice';
import "../commonCss.scss";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import HeaderMenu from "./HeaderMenu";

const Header: React.FC = () => {
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profileList = useSelector((state: RootState) => state.profile.profiles);
    const selectedProfile = useSelector((state: RootState) => state.profile.selectedProfile);
    const CryptoJS = require('crypto-js');

    const location = useLocation();
    const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

    // 암호화 함수
    const encryptData = (data: string) => {
        return CryptoJS.AES.encrypt(data, encryptionKey).toString();
    };

    // 복호화 함수
    const decryptData = (cipherText: string) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    useEffect(() => {
        const encryptedProfile = localStorage.getItem('selectedProfile');
        if (encryptedProfile) {
            try {
                const decryptedProfile = decryptData(encryptedProfile);
                dispatch(setSelectedProfile(JSON.parse(decryptedProfile)));
            } catch (error) {
                console.error('Failed to decrypt profile:', error);
            }
        }

        // 새로고침 시 프로필 리스트를 다시 가져오기 위한 로직 추가
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
            fetchProfileData(jwtToken);
        }
    }, [dispatch]);

    const serverIp: string | undefined = process.env.REACT_APP_HOST;
    const port: string | undefined = process.env.REACT_APP_BACK_PORT;

    const fetchProfileData = async (jwtToken: string) => {
        try {
            const response = await fetch(`http://${serverIp}:${port}/api/profiles/search`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
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

    useEffect(() => {
        if (!Array.isArray(profileList)) return;
    }, [selectedProfile, profileList]);

    const handleChange = (event: SelectChangeEvent) => {
        const selectedChildId = Number(event.target.value);
        const newSelectedProfile = profileList.find(profile => profile.childId === selectedChildId) || null;
        if (newSelectedProfile) {
            dispatch(setSelectedProfile(newSelectedProfile));
            const encryptedProfile = encryptData(JSON.stringify(newSelectedProfile));
            localStorage.setItem('selectedProfile', encryptedProfile);
        }
    };

    const handleLogoClick = () => {
        if (location.pathname !== '/profile') {
            navigate('/');
        }
    };

    return (
        <div>
            <div className={isPortrait ? "ph-header" : "pc-header"}>
                <div className={isPortrait ? "" : "pc-img-div"}>
                    <img
                        className={isPortrait ? "ph-logo-img" : "pc-logo-img"}
                        src="/img/logo.png"
                        alt={""}
                        onClick={handleLogoClick}
                        style={{ cursor: location.pathname !== '/profile' ? 'pointer' : 'default' }}
                    />
                </div>

                <div className={isPortrait ? "ph-choose-child" : "pc-choose-child"}>
                    {isPortrait || location.pathname === '/profile' ? <></> :
                        <>
                            <FormControl sx={{ m: 1, minWidth: 100 }}>
                                <Select
                                    value={selectedProfile ? selectedProfile.childId.toString() : ""}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    style={{ height: "100%" }}
                                >
                                    {Array.isArray(profileList) && profileList.map((profile) => (
                                        <MenuItem key={profile.childId} value={profile.childId.toString()}>
                                            {`${profile.name} (${new Date().getFullYear() - new Date(profile.birthdate).getFullYear()}세)`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <HeaderMenu selectedProfile={selectedProfile} />
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Header;
