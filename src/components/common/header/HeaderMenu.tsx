import React, { useEffect } from "react";
import { MenuItem } from "@mui/material";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedProfile } from "../../../redux/slices/profileSlice";

interface HeaderMenuProps {
    selectedProfile: any;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ selectedProfile }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // 디버깅: 선택된 프로필 데이터 확인
        // console.log('Selected Profile in HeaderMenu:', selectedProfile);
    }, [selectedProfile]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // 로그아웃 시 로컬 스토리지에서 토큰과 프로필 정보 제거
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('selectedProfile');
        localStorage.removeItem('profileList');
        // 강제로 페이지 새로고침
        window.location.reload();
        // 로그인 페이지로 리다이렉트
        navigate('/login');
    };

    const handleNavigateProfileList = () => {
        navigate('/profile');
    };

    const handleNavigateEditProfile = () => {
        if (selectedProfile) {
            navigate('/profile?action=edit')
        }
    };

    const handleNavigateAddProfile = () => {
        dispatch(setSelectedProfile(null));
        navigate('/profile?action=add');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {selectedProfile?.imageProfile ? (
                            <img
                                src={`data:image/png;base64,${selectedProfile.imageProfile}`}
                                alt=""
                                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                            />
                        ) : null}
                    </Avatar>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleNavigateProfileList}>
                    <Avatar /> Profile List
                </MenuItem>
                <MenuItem onClick={handleNavigateEditProfile}>
                    <Avatar /> My profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleNavigateAddProfile}>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default HeaderMenu;
