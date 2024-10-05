import React, { useEffect } from 'react';
import { useMediaQuery } from "react-responsive";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { setSelectedProfile } from '../../../redux/slices/profileSlice';
import "../commonCss.scss";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import HeaderMenu from "./HeaderMenu";

const Header: React.FC = () => {
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profileList = useSelector((state: RootState) => state.profile.profiles);
    const selectedProfile = useSelector((state: RootState) => state.profile.selectedProfile);


    const location = useLocation();

    useEffect(() => {
        if (!Array.isArray(profileList)) return;
        // console.log('Selected profile in Header:', selectedProfile);
        // console.log('Profile list in Header:', profileList);
    }, [selectedProfile, profileList]);

    const handleChange = (event: SelectChangeEvent) => {
        const selectedChildId = Number(event.target.value);
        const newSelectedProfile = profileList.find(profile => profile.childId === selectedChildId) || null;
        // console.log('New selected profile:', newSelectedProfile);
        if (newSelectedProfile) {
            dispatch(setSelectedProfile(newSelectedProfile));
            localStorage.setItem('selectedProfile', JSON.stringify(newSelectedProfile));
        }
    };

    const handleLogoClick = () => {
        navigate('/');
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
                        style={{ cursor: 'pointer' }}
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
