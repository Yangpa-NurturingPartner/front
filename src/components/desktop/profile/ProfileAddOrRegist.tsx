import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from "react-router-dom";

interface ProfileAddOrRegistProps {
    setRegis: React.Dispatch<React.SetStateAction<boolean>>;
    onProfileAdded: () => void;
    selectedProfile: any | null; // 선택된 프로필 정보
}

const ProfileAddOrRegist: React.FC<ProfileAddOrRegistProps> = ({ setRegis, onProfileAdded, selectedProfile }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(selectedProfile?.imageProfile || null);
    const [name, setName] = useState<string>(selectedProfile?.name || "");
    const [birthdate, setBirthdate] = useState<Dayjs | null>(selectedProfile ? dayjs(selectedProfile.birthdate) : null);
    const [sex, setSex] = useState<1 | 2 | null>(selectedProfile?.sex || null);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedProfile) {
            setName(selectedProfile.name);
            setBirthdate(dayjs(selectedProfile.birthdate));
            setSex(selectedProfile.sex);
            setSelectedImage(selectedProfile.imageProfile ? `data:image/png;base64,${selectedProfile.imageProfile}` : null);
        }
    }, [selectedProfile]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const email = localStorage.getItem('email');

        if (!jwtToken || !email) {
            console.error("JWT token or email is missing");
            navigate("/login");
            return;
        }

        try {
            let imageBase64 = null;
            if (selectedImage) {
                const base64String = selectedImage.split(',')[1];
                imageBase64 = base64String ? base64String : null;
            }

            const method = selectedProfile ? 'PUT' : 'POST';
            const url = selectedProfile
                ? `${process.env.REACT_APP_API_URL}/api/profiles/${selectedProfile.childId}`
                : `${process.env.REACT_APP_API_URL}/api/profiles/add`;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    sex,
                    birthdate: birthdate ? birthdate.format('YYYY-MM-DD') : null,
                    imageProfile: imageBase64,
                    memberUser: { userEmail: email }
                })
            });

            if (!response.ok) {
                console.error('HTTP Error:', response.status, response.statusText);
                throw new Error('Failed to add or update profile');
            }

            const result = await response.json();
            console.log("Profile added/updated successfully:", result);
            onProfileAdded();
        } catch (error) {
            console.error('Error adding or updating profile:', error);
        }
    };

    const handleProfileDelete = async () => {
        if (!selectedProfile) return;

        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            console.error("JWT token or email is missing");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profiles/${selectedProfile.childId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                }
            });

            if (!response.ok) {
                console.error('HTTP Error:', response.status, response.statusText);
                throw new Error('Failed to delete profile');
            }

            // console.log("Profile deleted successfully");
            onProfileAdded();
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    };

    return (
        <>
            <div className={"pc-profile-ar-title"}>
                <span>{selectedProfile ? "프로필 수정" : "아이 등록"}</span>
            </div>

            <div className={"pc-profile-ar-close"} onClick={() => setRegis(false)}>
                <img src={"/img/close.png"} alt={""} />
            </div>

            <div className={"pc-profile-ar-body"}>
                <div
                    className={"pc-profile-ar-register-img-box"}
                    onClick={() => document.getElementById("image-upload")?.click()}
                >
                    <div className={"pc-profile-ar-register-img"}>
                        <img src={selectedImage || "/img/addChild.png"} alt={""} />
                    </div>
                    <span>아이 등록</span>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                </div>

                <div className={"pc-profile-ar-input-list"}>
                    <div className={"pc-profile-ar-input-box"}>
                        <div className={"pc-profile-ar-input-title"}>
                            <span>이름/ 애칭</span>
                            <span className={"pc-profile-ar-star"}>*</span>
                        </div>
                        <TextField
                            id="outlined-basic"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={"pc-profile-ar-input-box"}>
                        <div className={"pc-profile-ar-input-title"}>
                            <span>생년 월일</span>
                            <span className={"pc-profile-ar-star"}>*</span>
                        </div>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={birthdate}
                                onChange={(date) => setBirthdate(date)}
                            />
                        </LocalizationProvider>
                    </div>

                    <div className={"pc-profile-ar-input-box"}>
                        <div className={"pc-profile-ar-input-title"}>
                            <span>성별</span>
                            <span className={"pc-profile-ar-star"}>*</span>
                        </div>

                        <div className={"pc-profile-ar-choose-sex"}>
                            <Button
                                className={sex === 1 ? "MuiButton-contained" : "MuiButton-outlined"}
                                variant={sex === 1 ? "contained" : "outlined"}
                                onClick={() => setSex(1)}
                            >
                                남자
                            </Button>
                            <Button
                                className={sex === 2 ? "MuiButton-contained" : "MuiButton-outlined"}
                                variant={sex === 2 ? "contained" : "outlined"}
                                onClick={() => setSex(2)}
                            >
                                여자
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", gap: "16px" }}>
                <Button
                    id="register-button"
                    variant="contained"
                    size={"large"}
                    onClick={handleProfileSubmit}
                >
                    {selectedProfile ? "수정 완료" : "등록 완료"}
                </Button>
                {selectedProfile && (
                    <Button
                        id="delete-button"
                        variant="outlined"
                        size={"large"}
                        color="error"
                        onClick={handleProfileDelete}
                    >
                        삭제
                    </Button>
                )}
            </div>
        </>
    );
};

export default ProfileAddOrRegist;
