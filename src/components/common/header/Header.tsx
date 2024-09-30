import React, { useState, useEffect } from 'react';
import { useMediaQuery } from "react-responsive";
import "../commonCss.scss";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import HeaderMenu from "./HeaderMenu";

interface ProfileData {
    childId: number;
    name: string;
    sex: number;
    birthdate: string;
    imageProfile: string;
}

const Header: React.FC = () => {
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null);
    const [profileList, setProfileList] = useState<ProfileData[]>([]);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedProfileData = localStorage.getItem('profileList');
        const storedSelectedProfile = localStorage.getItem('selectedProfile');
        const storedToken = localStorage.getItem('jwtToken');

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedProfileData) {
            const parsedProfileList = JSON.parse(storedProfileData);
            setProfileList(parsedProfileList);

            if (storedSelectedProfile) {
                setSelectedProfile(JSON.parse(storedSelectedProfile));
            } else if (parsedProfileList.length > 0) {
                setSelectedProfile(parsedProfileList[0]);
            }
        }
    }, [selectedProfile]);

    const handleChange = (event: SelectChangeEvent) => {
        const selectedChildId = Number(event.target.value);
        const newSelectedProfile = profileList.find(profile => profile.childId === selectedChildId) || null;

        if (newSelectedProfile) {
            setSelectedProfile(newSelectedProfile);
            localStorage.setItem('selectedProfile', JSON.stringify(newSelectedProfile));
        }
    };

    return (
        <div>
            <div className={isPortrait ? "ph-header" : "pc-header"}>
                <div className={isPortrait ? "" : "pc-img-div"}>
                    <img className={isPortrait ? "ph-logo-img" : "pc-logo-img"} src="/img/logo.png" alt={""} />
                </div>

                <div className={isPortrait ? "ph-choose-child" : "pc-choose-child"}>
                    <FormControl sx={{ m: 1, minWidth: 100 }}>
                        <Select
                            value={selectedProfile ? selectedProfile.childId.toString() : ""}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            style={{ height: "100%" }}
                        >
                            {profileList.map(profile => (
                                <MenuItem key={profile.childId} value={profile.childId}>
                                    {`${profile.name} (${new Date().getFullYear() - new Date(profile.birthdate).getFullYear()}세)`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {isPortrait ? <></> : <HeaderMenu selectedProfile={selectedProfile} />}
                </div>
            </div>
        </div>
    );
};

export default Header;
